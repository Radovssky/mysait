import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

import { NextResponse } from "next/server";

import { UPLOADS_DIR } from "@/lib/storage";

export const runtime = "nodejs";

const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type Context = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, { params }: Context) {
  const { path } = await params;
  const relative = path.join("/");

  if (relative.includes("..") || relative.startsWith("/")) {
    return new NextResponse("invalid path", { status: 400 });
  }

  const fullPath = join(UPLOADS_DIR, relative);
  if (!existsSync(fullPath)) {
    return new NextResponse("not found", { status: 404 });
  }

  const [buffer, stats] = await Promise.all([
    readFile(fullPath),
    stat(fullPath),
  ]);

  const ext = extname(fullPath).toLowerCase();
  const mime = mimeByExt[ext] ?? "application/octet-stream";

  const body = new Uint8Array(buffer);
  return new NextResponse(body, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stats.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
