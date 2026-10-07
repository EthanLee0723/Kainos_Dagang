import type { Locale } from "./config";

/** Replace `{name}` placeholders. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function plural(
  locale: Locale,
  forms: { one: string; other: string },
  count: number,
) {
  const rule = new Intl.PluralRules(locale).select(count);
  return format(rule === "one" ? forms.one : forms.other, { count });
}

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}
