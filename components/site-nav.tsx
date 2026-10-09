import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { company } from "@/lib/site";
import { generalEnquiryUrl } from "@/lib/whatsapp";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { WhatsAppIcon } from "./whatsapp-icon";

export function navItems(dict: Dictionary, locale: Locale) {
  return [
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}#brands`, label: dict.nav.brands },
    { href: `/${locale}#branches`, label: dict.nav.branches },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];
}

/** The row of links set along the top edge of the signboard. */
export function NavRow({
  dict,
  locale,
  brand,
}: {
  dict: Dictionary;
  locale: Locale;
  /** Optional left-hand slot, e.g. the compact logo on inner pages. */
  brand?: React.ReactNode;
}) {
  const items = navItems(dict, locale);
  return (
    <div className="flex h-16 items-center gap-4 sm:h-20 lg:gap-8">
      {brand}
      <nav aria-label={dict.nav.primary} className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative inline-flex h-11 items-center px-3 text-[0.9rem] font-medium text-paper/75 transition-colors duration-150 after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-paper after:transition-transform after:duration-300 after:ease-out-strong hover:text-paper hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <LanguageSwitcher current={locale} label={dict.nav.language} className="hidden text-paper sm:block" />
        <a
          href={generalEnquiryUrl(locale)}
          target="_blank"
          rel="noopener"
          className="hidden h-11 items-center gap-2.5 rounded-full border border-paper/25 pr-4 pl-3 text-[0.9rem] font-medium text-paper transition-colors duration-150 hover:border-paper/60 md:inline-flex"
        >
          <WhatsAppIcon className="size-5 text-whatsapp" />
          <span className="tabular">{company.phoneDisplay}</span>
        </a>
        <MobileNav
          locale={locale}
          items={items}
          labels={{
            menu: dict.nav.menu,
            close: dict.nav.close,
            language: dict.nav.language,
            whatsapp: dict.whatsapp.cta,
          }}
          whatsappHref={generalEnquiryUrl(locale)}
        />
      </div>
    </div>
  );
}
