import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import {
  projects,
  projectScreenshots,
  testimonials,
  type Project,
  type ProjectScreenshot,
  type Testimonial,
} from "../../drizzle/schema";
import { db } from "./db";

export type ProjectWithRelations = Project & {
  screenshots: ProjectScreenshot[];
  testimonials: Testimonial[];
};

async function fetchPublishedProjects(): Promise<Project[]> {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.isPublished, true))
      .orderBy(desc(projects.sortOrder), desc(projects.publishedAt));
  } catch (error) {
    console.warn("[projects] getPublishedProjects failed:", error);
    return [];
  }
}

async function fetchProjectBySlug(
  slug: string,
): Promise<ProjectWithRelations | null> {
  try {
    const [row] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
      .limit(1);

    if (!row) return null;

    const [shots, projectTestimonials] = await Promise.all([
      db
        .select()
        .from(projectScreenshots)
        .where(eq(projectScreenshots.projectId, row.id))
        .orderBy(asc(projectScreenshots.sortOrder)),
      db
        .select()
        .from(testimonials)
        .where(eq(testimonials.projectId, row.id))
        .orderBy(asc(testimonials.sortOrder)),
    ]);

    return { ...row, screenshots: shots, testimonials: projectTestimonials };
  } catch (error) {
    console.warn(`[projects] getProjectBySlug(${slug}) failed:`, error);
    return null;
  }
}

async function fetchPublishedSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  try {
    return await db
      .select({ slug: projects.slug, updatedAt: projects.updatedAt })
      .from(projects)
      .where(eq(projects.isPublished, true));
  } catch {
    return [];
  }
}

export const getPublishedProjects = unstable_cache(
  fetchPublishedProjects,
  ["projects:published"],
  { revalidate: 60, tags: ["projects"] },
);

export const getProjectBySlug = (slug: string) =>
  unstable_cache(
    () => fetchProjectBySlug(slug),
    [`projects:slug:${slug}`],
    { revalidate: 60, tags: ["projects", `project:${slug}`] },
  )();

export const getPublishedSlugs = unstable_cache(
  fetchPublishedSlugs,
  ["projects:slugs"],
  { revalidate: 60, tags: ["projects"] },
);
