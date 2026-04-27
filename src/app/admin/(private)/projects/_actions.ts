"use server";

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { deleteImage } from "@/lib/storage";

import { projects, projectScreenshots, testimonials } from "@db/schema";

function ensureSlug(slug: string, title: string): string {
  if (slug) return slug;
  if (title) {
    const fromTitle = slugify(title);
    if (fromTitle) return fromTitle;
  }
  return `case-${randomUUID().slice(0, 8)}`;
}

const categorySchema = z.enum([
  "chatbot",
  "ai_agent",
  "voice",
  "content",
  "custom",
]);

const projectSchema = z.object({
  title: z.string().max(200).default(""),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9-]*$/, "Только латиница, цифры и дефис")
    .default(""),
  shortDescription: z.string().max(500).default(""),
  coverImage: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  category: categorySchema.optional().or(z.literal("").transform(() => undefined)),
  client: z.string().max(200).optional().or(z.literal("").transform(() => undefined)),
  context: z.string().optional().or(z.literal("").transform(() => undefined)),
  solution: z.string().optional().or(z.literal("").transform(() => undefined)),
  stack: z.array(z.string()).optional().default([]),
  result: z.string().optional().or(z.literal("").transform(() => undefined)),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().or(z.literal("").transform(() => undefined)),
});

export type ProjectFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "ok" };

function readForm(formData: FormData) {
  const stackRaw = String(formData.get("stack") ?? "");
  const stack = stackRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    category: String(formData.get("category") ?? ""),
    client: String(formData.get("client") ?? ""),
    context: String(formData.get("context") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    stack,
    result: String(formData.get("result") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
    isPublished: formData.get("isPublished") === "on",
    publishedAt: String(formData.get("publishedAt") ?? ""),
  };
}

function toErrorState(error: z.ZodError): ProjectFormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return {
    status: "error",
    message: "Проверьте поля формы",
    fieldErrors,
  };
}

function invalidate(slug: string) {
  revalidateTag("projects", "max");
  revalidateTag(`project:${slug}`, "max");
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin");
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(readForm(formData));
  if (!parsed.success) return toErrorState(parsed.error);

  const data = parsed.data;
  const finalSlug = ensureSlug(data.slug, data.title);
  let createdId: string;

  try {
    const [created] = await db
      .insert(projects)
      .values({
        title: data.title,
        slug: finalSlug,
        shortDescription: data.shortDescription,
        coverImage: data.coverImage,
        category: data.category,
        client: data.client,
        context: data.context,
        solution: data.solution,
        stack: data.stack,
        result: data.result,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        updatedAt: new Date(),
      })
      .returning({ id: projects.id });
    createdId = created.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "DB error";
    return {
      status: "error",
      message: message.includes("unique")
        ? `Slug «${finalSlug}» уже занят`
        : message,
    };
  }

  invalidate(finalSlug);
  redirect(`/admin/projects/${createdId}/edit?saved=1`);
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(readForm(formData));
  if (!parsed.success) return toErrorState(parsed.error);

  const data = parsed.data;
  const finalSlug = ensureSlug(data.slug, data.title);

  let previousCover: string | null = null;
  try {
    const [prev] = await db
      .select({ coverImage: projects.coverImage })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    previousCover = prev?.coverImage ?? null;

    await db
      .update(projects)
      .set({
        title: data.title,
        slug: finalSlug,
        shortDescription: data.shortDescription,
        coverImage: data.coverImage,
        category: data.category,
        client: data.client,
        context: data.context,
        solution: data.solution,
        stack: data.stack,
        result: data.result,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "DB error";
    return {
      status: "error",
      message: message.includes("unique")
        ? `Slug «${finalSlug}» уже занят`
        : message,
    };
  }

  if (previousCover && previousCover !== data.coverImage) {
    await deleteImage(previousCover);
  }

  invalidate(finalSlug);
  return { status: "ok" };
}

export async function togglePublishAction(id: string, current: boolean) {
  await requireAdmin();
  const [row] = await db
    .update(projects)
    .set({
      isPublished: !current,
      publishedAt: !current ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning({ slug: projects.slug });
  if (row) invalidate(row.slug);
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();

  const [project] = await db
    .select({ slug: projects.slug, coverImage: projects.coverImage })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) redirect("/admin");

  const screenshots = await db
    .select({ imagePath: projectScreenshots.imagePath })
    .from(projectScreenshots)
    .where(eq(projectScreenshots.projectId, id));

  const testimonialPhotos = await db
    .select({ photoPath: testimonials.photoPath })
    .from(testimonials)
    .where(eq(testimonials.projectId, id));

  await db.delete(projects).where(eq(projects.id, id));

  await Promise.all([
    deleteImage(project.coverImage),
    ...screenshots.map((s) => deleteImage(s.imagePath)),
    ...testimonialPhotos.map((t) => deleteImage(t.photoPath)),
  ]);

  invalidate(project.slug);
  redirect("/admin");
}
