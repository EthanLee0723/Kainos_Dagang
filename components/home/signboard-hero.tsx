import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo";
import { NavRow } from "@/components/site-nav";
import { container } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { categories } from "@/lib/products";
import { branches, company, pick } from "@/lib/site";

/**
 * The first viewport is the shop's black signboard: nav along its top edge,
 * the lockup at signage scale, a category board set into the face, and the
 * legal "owned by" line along the bottom edge, as on the real signs.
 */
export function SignboardHero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <header className="bg-ink text-paper">
      <div className={container}>
        <NavRow dict={dict} locale={locale} />

        <div className="grid gap-8 pt-4 pb-10 sm:pt-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pt-12 lg:pb-14">
          <LogoLockup label="Kainos Dagang" className="rise h-auto w-full max-w-[48rem]" />
          <div className="rise [--rise-delay:140ms] lg:pb-1">
            <h1 className="max-w-[22ch] text-[1.65rem] leading-[1.15] font-semibold tracking-[-0.015em] sm:text-[2.1rem] lg:text-[clamp(1.9rem,2.5vw,2.5rem)]">
              <span className="sr-only">Kainos Dagang: </span>
              {dict.sign.hookTitle}
            </h1>
            <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-paper/70 sm:text-[1.08rem]">
              {dict.sign.hookBody}
            </p>
          </div>
        </div>

        <nav aria-label={dict.sign.directoryLabel} className="rise -mx-4 border-t [--rise-delay:280ms] border-ink-line sm:mx-0">
          <ul className="flex snap-x gap-x-1 overflow-x-auto px-4 py-2 [mask-image:linear-gradient(to_right,#000_80%,transparent)] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:px-0 sm:[mask-image:none]">
            {categories.map((c, i) => (
              <li key={c.id} className="flex shrink-0 snap-start items-center">
                {i > 0 && (
                  <span aria-hidden className="mr-1 text-orange">
                    /
                  </span>
                )}
                <Link
                  href={`/${locale}/products?category=${c.id}`}
                  className="font-display inline-flex h-11 items-center px-2 text-[0.72rem] text-paper/80 uppercase transition-colors duration-150 hover:text-orange sm:text-[0.78rem]"
                >
                  {pick(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rise flex flex-col gap-1.5 border-t border-ink-line py-4 [--rise-delay:360ms] text-[0.75rem] tracking-[0.02em] text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>
            {dict.sign.owner}: {company.legalName}{" "}
            <span className="tabular">{company.registration}</span>
          </p>
          <p>
            <Link href={`/${locale}#branches`} className="transition-colors hover:text-paper">
              {branches.map((b) => b.name).join(" · ")}
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}
