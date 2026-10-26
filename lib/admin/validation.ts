import { z } from "zod";
import type { FieldErrors } from "./format";

/*
 * Shared rules for admin forms. Messages are dictionary keys
 * ("common.required"), shown in the admin language by the form.
 */

export const text = z.string().trim();
export const required = text.min(1, "common.required");

/** Text shown on the site: English, Malay and Chinese are all required. */
export const localized = z.object({ en: required, ms: required, zh: required });

const emptyLocalized = { en: "", ms: "", zh: "" };

/** Optional text in three languages: all three filled in, or all three empty (stored as null). */
export const optionalLocalized = z
  .object({ en: text, ms: text, zh: text })
  .nullish()
  .transform((v) => v ?? emptyLocalized)
  .refine((v) => [v.en, v.ms, v.zh].every(Boolean) || ![v.en, v.ms, v.zh].some(Boolean), "products.packIncomplete")
  .transform((v) => (v.en ? v : null));

/** A phone number as people write it: digits with spaces, dashes or a leading +; 9 to 15 digits. */
export const phoneNumber = required.refine((v) => {
  const digits = v.replace(/\D/g, "");
  return /^\+?[\d\s()-]+$/.test(v) && digits.length >= 9 && digits.length <= 15;
}, "contact.phoneInvalid");

/** Lowercase letters, numbers and dashes: a URL key that is fixed once created. */
export const key = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "products.slugInvalid");

export const uuid = z.uuid();

/** Zod issues → { "name.ms": { key: "common.required" } }, first message per field. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    out[path] ??= { key: issue.message };
  }
  return out;
}
