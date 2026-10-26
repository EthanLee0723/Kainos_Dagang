import type { AdminDictionary } from "./dictionaries/en";

/** A message key from a Server Action ("contact.phoneInvalid"), resolved in the admin language. */
export type Message = { key: string; params?: Record<string, string | number> };

export type FieldErrors = Record<string, Message>;

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; errors?: FieldErrors; message?: Message };

export function fill(template: string, params: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m));
}

/** Look a dotted key up in the dictionary, e.g. tr(t, "common.required"). */
export function tr(t: AdminDictionary, message: Message | string) {
  const { key, params } = typeof message === "string" ? { key: message, params: undefined } : message;
  const value = key.split(".").reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], t);
  return typeof value === "string" ? fill(value, params) : key;
}

export function plural(forms: { one: string; other: string }, count: number) {
  return fill(count === 1 ? forms.one : forms.other, { count });
}
