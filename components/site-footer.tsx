import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { hoursRows } from "@/lib/hours";
import { categories } from "@/lib/products";
import { branches, company, pick } from "@/lib/site";
import { generalEnquiryUrl } from "@/lib/whatsapp";
import { LogoLockup } from "./brand/logo";
import { TaglineBand } from "./brand/tagline-band";
import { LanguageSwitcher } from "./language-switcher";

export function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="scroll-mt-4 bg-ink text-paper">
      <TaglineBand dict={dict} />
      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 pt-14 pb-28 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10 lg:px-10 lg:pt-20">
        <div>
          <Link href={`/${locale}`} aria-label={`Kainos Dagang, ${dict.nav.home}`} className="inline-block">
            <LogoLockup label={null} className="h-12 w-auto sm:h-14" />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/70">
            {company.legalName}
            <br />
            <span className="tabular">{company.registration}</span>
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm text-paper/55 uppercase">{dict.footer.shop}</h2>
          <ul className="mt-5 space-y-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${locale}/products?category=${c.id}`}
                  className="inline-block py-1 text-[0.95rem] text-paper/85 transition-colors hover:text-orange"
                >
                  {pick(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm text-paper/55 uppercase">{dict.nav.branches}</h2>
          <ul className="mt-5 space-y-4">
            {branches.map((b) => (
              <li key={b.id}>
                <p className="text-[0.95rem] font-semibold">{b.name}</p>
                <a
                  href={`tel:${b.phoneE164}`}
                  className="tabular text-[0.95rem] text-paper/75 transition-colors hover:text-orange"
                >
                  {b.phoneDisplay}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-[0.95rem] text-paper/55">{dict.hours.title}</h3>
          <dl className="mt-2 space-y-2 text-[0.95rem]">
            {hoursRows(locale, dict.hours).map((row) => (
              <div key={row.label}>
                <dt className="text-paper/75">{row.label}</dt>
                <dd className="tabular font-semibold">{row.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-display text-sm text-paper/55 uppercase">{dict.footer.contact}</h2>
          <dl className="mt-5 space-y-4 text-[0.95rem]">
            <div>
              <dt className="text-paper/55">{dict.branchesSection.mainLine}</dt>
              <dd>
                <a
                  href={generalEnquiryUrl(locale)}
                  target="_blank"
                  rel="noopener"
                  className="tabular font-semibold transition-colors hover:text-orange"
                >
                  {company.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-paper/55">{dict.branchesSection.email}</dt>
              <dd>
                <a
                  href={`mailto:${company.email}`}
                  className="break-all transition-colors hover:text-orange"
                >
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
          <LanguageSwitcher current={locale} label={dict.nav.language} className="mt-6 -ml-2.5 text-paper" />
        </div>
      </div>
      <div className="border-t border-ink-line">
        <div className="mx-auto max-w-[90rem] px-4 py-6 pr-24 sm:px-6 lg:px-10">
          <p className="text-xs text-paper/55">
            © {year} {company.legalName} {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
