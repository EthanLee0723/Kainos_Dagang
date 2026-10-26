"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import type { ActionResult } from "../format";
import { revalidateSite } from "../revalidate";
import { requireAdmin } from "../session";
import { fieldErrors, phoneNumber, required } from "../validation";

export type ContactInput = {
  legalName: string;
  registration: string;
  email: string;
  phone: string;
  sameAs: string[];
};

const contactSchema = z.object({
  legalName: required,
  registration: required,
  email: z.email("contact.emailInvalid"),
  phone: phoneNumber,
  sameAs: z.array(z.url({ protocol: /^https$/, error: "contact.urlInvalid" })),
});

export async function saveContact(input: ContactInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  await db
    .update(schema.settings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.settings.id, 1));
  revalidateSite();
  return { ok: true };
}
