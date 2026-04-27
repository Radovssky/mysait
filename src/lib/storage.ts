import "server-only";

import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const DEFAULT_DEV_DIR = resolve(process.cwd(), "uploads");
const DEFAULT_PROD_DIR = "/var/data/uploads";

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ??
  (process.env.NODE_ENV === "production" ? DEFAULT_PROD_DIR : DEFAULT_DEV_DIR);

export const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
export const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const extByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

async function ensureDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function saveImage(
  file: File,
): Promise<{ path: string; filename: string }> {
  if (!ALLOWED_MIMES.has(file.type)) {
    throw new Error(`Неподдерживаемый формат: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(
      `Файл больше ${(MAX_SIZE_BYTES / 1024 / 1024).toFixed(0)} МБ`,
    );
  }

  await ensureDir();

  const ext = extByMime[file.type] ?? extname(file.name) ?? ".bin";
  const filename = `${randomUUID()}${ext}`;
  const fullPath = join(UPLOADS_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return { path: `/api/uploads/${filename}`, filename };
}

export async function deleteImage(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/api/uploads/")) return;
  const filename = publicPath.replace("/api/uploads/", "");
  if (filename.includes("..") || filename.includes("/")) return;
  const fullPath = join(UPLOADS_DIR, filename);
  try {
    await unlink(fullPath);
  } catch {
    // already gone — fine
  }
}

export async function listOrphanFiles(
  referencedPaths: string[],
): Promise<string[]> {
  if (!existsSync(UPLOADS_DIR)) return [];
  const referenced = new Set(
    referencedPaths
      .filter(Boolean)
      .map((path) => path.replace("/api/uploads/", "")),
  );
  const all = await readdir(UPLOADS_DIR);
  return all.filter((file) => !referenced.has(file));
}
