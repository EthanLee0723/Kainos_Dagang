"use client";

import { usePathname } from "next/navigation";
import { htmlLang, LOCALE_COOKIE, localeLabels, locales, type Locale } from "@/lib/i18n/config";

function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * EN / BM / 中文. Plain links (full page loads) so <html lang>, fonts and
 * metadata always match the language; the choice is remembered in a cookie.
 */
export function LanguageSwitcher({
  current,
  label,
  className = "",
}: {
  current: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.replace(/^\/(en|ms|zh)(?=\/|$)/, "");

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center">
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <a
                href={`/${locale}${rest}`}
                hrefLang={htmlLang[locale]}
                lang={htmlLang[locale]}
                title={localeLabels[locale].name}
                aria-current={active ? "true" : undefined}
                onClick={() => remember(locale)}
                className={`relative inline-flex h-11 min-w-11 items-center justify-center px-2.5 text-[0.8rem] font-semibold tracking-wide transition-colors duration-150 ${
                  active
                    ? "text-current after:absolute after:inset-x-2.5 after:bottom-2 after:h-0.5 after:bg-orange"
                    : "text-current/60 hover:text-current"
                }`}
              >
                {localeLabels[locale].short}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
