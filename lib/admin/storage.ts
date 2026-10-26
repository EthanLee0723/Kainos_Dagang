import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/*
 * Where uploaded product photos go:
 * - On Vercel, or wherever Blob credentials are set: Vercel Blob (public URLs on
 *   *.public.blob.vercel-storage.com). A store connected in the Vercel dashboard
 *   authenticates either with BLOB_READ_WRITE_TOKEN or with OIDC + BLOB_STORE_ID;
 *   @vercel/blob reads both.
 * - Otherwise: ./uploads on this server's disk, served at /media/<file>. Fine for
 *   local development or a VPS with a persistent disk. Never on Vercel, whose
 *   disk is read-only.
 * Photos under /products/ ship with the site and are never deleted from here.
 */

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export const PHOTO_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const blobConfigured = () =>
  !!(process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function storePhoto(file: File, nameHint: string) {
  const ext = PHOTO_TYPES[file.type];
  if (!ext) throw new Error(`Unsupported photo type: ${file.type}`);
  const base = nameHint.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo";

  if (blobConfigured()) {
    const blob = await put(`products/${base}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return blob.url;
  }

  const name = `${base}-${randomUUID().slice(0, 8)}.${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/media/${name}`;
}

export async function removePhoto(url: string) {
  if (url.startsWith("/media/")) {
    await rm(path.join(UPLOADS_DIR, path.basename(url)), { force: true });
  } else if (/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url) && blobConfigured()) {
    await del(url);
  }
}
