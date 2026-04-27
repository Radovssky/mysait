"use server";

import { eq, max } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { deleteImage, saveImage } from "@/lib/storage";

import { projects, projectScreenshots } from "@db/schema";

async function invalidateForProject(projectId: string) {
  const [row] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  revalidateTag("projects", "max");
  if (row) {
    revalidateTag(`project:${row.slug}`, "max");
    revalidatePath(`/projects/${row.slug}`);
  }
  revalidatePath("/admin");
}

export async function addScreenshotAction(
  projectId: string,
  formData: FormData,
) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Файл обязателен");
  }
  const captionInput = String(formData.get("caption") ?? "").trim();
  const caption = captionInput.length > 0 ? captionInput : null;

  const { path } = await saveImage(file);

  const [{ next }] = await db
    .select({ next: max(projectScreenshots.sortOrder) })
    .from(projectScreenshots)
    .where(eq(projectScreenshots.projectId, projectId));

  const sortOrder = (next ?? -1) + 1;

  await db.insert(projectScreenshots).values({
    projectId,
    imagePath: path,
    caption,
    sortOrder,
  });

  await invalidateForProject(projectId);
}

export async function updateScreenshotAction(
  id: string,
  formData: FormData,
) {
  await requireAdmin();

  const captionInput = String(formData.get("caption") ?? "").trim();
  const caption = captionInput.length > 0 ? captionInput : null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  const [row] = await db
    .update(projectScreenshots)
    .set({ caption, sortOrder })
    .where(eq(projectScreenshots.id, id))
    .returning({ projectId: projectScreenshots.projectId });

  if (row) await invalidateForProject(row.projectId);
}

export async function deleteScreenshotAction(id: string) {
  await requireAdmin();

  const [row] = await db
    .delete(projectScreenshots)
    .where(eq(projectScreenshots.id, id))
    .returning();

  if (row) {
    await deleteImage(row.imagePath);
    await invalidateForProject(row.projectId);
  }
}
