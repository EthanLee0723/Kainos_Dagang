"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { daysToHours } from "@/lib/hours";
import type { ActionResult } from "../format";
import { revalidateSite } from "../revalidate";
import { requireAdmin } from "../session";
import { slugify, uniqueSlug } from "../slug";
import { fieldErrors, localized, phoneNumber, required, text, uuid } from "../validation";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "common.required");

const branchSchema = z.object({
  id: uuid.optional(),
  name: required,
  area: localized,
  phone: phoneNumber,
  addressLines: z.array(text).transform((lines) => lines.filter(Boolean)).pipe(z.array(text).min(1, "common.required")),
  street: required,
  locality: required,
  postalCode: required,
  mapsUrl: z.union([z.literal(""), z.url({ protocol: /^https$/, error: "contact.urlInvalid" })]),
  days: z
    .array(z.object({ open: z.boolean(), opens: time, closes: time }).refine((d) => !d.open || d.opens < d.closes, "branches.hoursInvalid"))
    .length(7),
});

export type BranchInput = z.input<typeof branchSchema>;

export async function saveBranch(input: BranchInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = branchSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const { id, days, mapsUrl, ...fields } = parsed.data;
  const values = { ...fields, mapsUrl: mapsUrl || null, hours: daysToHours(days) };

  let savedId = id;
  if (id) {
    await db.update(schema.branches).set(values).where(eq(schema.branches.id, id));
  } else {
    const existing = await db.select({ slug: schema.branches.slug }).from(schema.branches);
    const [{ n }] = await db.select({ n: count() }).from(schema.branches);
    const [row] = await db
      .insert(schema.branches)
      .values({ ...values, slug: uniqueSlug(slugify(fields.name), new Set(existing.map((b) => b.slug))), position: n })
      .returning({ id: schema.branches.id });
    savedId = row.id;
  }
  revalidateSite();
  return { ok: true, data: { id: savedId! } };
}

export async function deleteBranch(id: string): Promise<ActionResult> {
  await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(schema.branches);
  if (n <= 1) return { ok: false, message: { key: "branches.deleteLast" } };
  await db.delete(schema.branches).where(eq(schema.branches.id, uuid.parse(id)));
  revalidateSite();
  return { ok: true };
}

export async function reorderBranches(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const order = z.array(uuid).parse(ids);
  await db.transaction(async (tx) => {
    for (const [position, id] of order.entries()) {
      await tx.update(schema.branches).set({ position }).where(eq(schema.branches.id, id));
    }
  });
  revalidateSite();
  return { ok: true };
}
