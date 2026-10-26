import "server-only";
import { revalidatePath } from "next/cache";

/**
 * After any admin save: every public page, the sitemap and llms.txt are
 * regenerated on their next visit, so the change shows straight away.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/manifest.webmanifest");
}
