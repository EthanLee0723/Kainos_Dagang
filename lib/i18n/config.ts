export const locales = ["en", "ms", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that remembers a language the visitor picked in the switcher. */
export const LOCALE_COOKIE = "kd_locale";

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ms: { short: "BM", name: "Bahasa Melayu" },
  zh: { short: "中文", name: "简体中文" },
};

/** Value for `<html lang>`: the Chinese content is Simplified. */
export const htmlLang: Record<Locale, string> = {
  en: "en-MY",
  ms: "ms-MY",
  zh: "zh-Hans-MY",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Pick the best supported locale from an Accept-Language header, honouring
 * q-weights. Any `zh-*` tag maps to Simplified Chinese, any `ms-*` to Malay.
 */
export function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      return {
        primary: tag.toLowerCase().split("-")[0],
        q: q ? Number.parseFloat(q.slice(2)) || 0 : 1,
        index,
      };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const { primary } of ranked) {
    if (isLocale(primary)) return primary;
  }
  return defaultLocale;
}
