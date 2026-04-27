"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { deleteImage } from "@/lib/storage";

import { projects, testimonials } from "@db/schema";

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

export async function saveTestimonialAction(
  projectId: string,
  formData: FormData,
) {
  await requireAdmin();

  const authorName = String(formData.get("authorName") ?? "").trim();
  if (!authorName) throw new Error("Имя автора обязательно");

  const text = String(formData.get("text") ?? "").trim();
  if (!text) throw new Error("Текст отзыва обязателен");

  const authorRoleRaw = String(formData.get("authorRole") ?? "").trim();
  const authorRole = authorRoleRaw.length > 0 ? authorRoleRaw : null;

  const photoPathRaw = String(formData.get("photoPath") ?? "").trim();
  const photoPath = photoPathRaw.length > 0 ? photoPathRaw : null;

  const [existing] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.projectId, projectId))
    .limit(1);

  if (existing) {
    if (
      existing.photoPath &&
      existing.photoPath !== photoPath
    ) {
      await deleteImage(existing.photoPath);
    }
    await db
      .update(testimonials)
      .set({
        authorName,
        authorRole,
        text,
        photoPath,
      })
      .where(eq(testimonials.id, existing.id));
  } else {
    await db.insert(testimonials).values({
      projectId,
      authorName,
      authorRole,
      text,
      photoPath,
      sortOrder: 0,
    });
  }

  await invalidateForProject(projectId);
}

export async function deleteTestimonialAction(projectId: string) {
  await requireAdmin();

  const [row] = await db
    .delete(testimonials)
    .where(eq(testimonials.projectId, projectId))
    .returning({ photoPath: testimonials.photoPath });

  if (row?.photoPath) await deleteImage(row.photoPath);
  await invalidateForProject(projectId);
}
