import { isAdmin } from "@/lib/admin/session";
import { PHOTO_TYPES, storePhoto } from "@/lib/admin/storage";

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Upload one product photo (the admin shrinks it in the browser first). Returns
 * its URL, or `{ error }` with a reason the admin shows next to the file name.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out. Sign in again and retry." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  if (!(file.type in PHOTO_TYPES)) {
    return Response.json({ error: `Unsupported file type (${file.type || "unknown"}). Use JPEG, PNG or WebP.` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 10 MB." }, { status: 413 });

  try {
    const url = await storePhoto(file, String(form?.get("name") ?? "photo"));
    return Response.json({ url });
  } catch (error) {
    // Shows in the host's runtime logs (Vercel: project → Logs).
    console.error("Photo upload failed:", error);
    const reason = error instanceof Error ? error.message : String(error);
    return Response.json({ error: `Storage error: ${reason}` }, { status: 500 });
  }
}
