import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/admin/storage";

const types: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

/**
 * Photos uploaded in the admin when they're stored on this server's disk
 * (no BLOB_READ_WRITE_TOKEN). File names are unique, so they cache forever.
 */
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  const type = types[path.extname(name).toLowerCase()];
  if (name !== file || !type) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(path.join(UPLOADS_DIR, name));
    return new Response(body, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
