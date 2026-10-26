import { isAdmin } from "@/lib/admin/session";
import { PHOTO_TYPES, storePhoto } from "@/lib/admin/storage";

const MAX_BYTES = 10 * 1024 * 1024;

/** Upload one product photo (the admin resizes it in the browser first). Returns its URL. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "no file" }, { status: 400 });
  if (!(file.type in PHOTO_TYPES)) return Response.json({ error: "unsupported type" }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "too large" }, { status: 413 });

  const url = await storePhoto(file, String(form?.get("name") ?? "photo"));
  return Response.json({ url });
}
