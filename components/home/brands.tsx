import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { button, container } from "@/components/ui";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { plural } from "@/lib/i18n/format";
import { brands, productsByBrand } from "@/lib/products";
import { pick } from "@/lib/site";
import { generalEnquiryUrl } from "@/lib/whatsapp";

/** Brands stocked, set like the brand plate on the shop's metal signboard. Never "authorised". */
export function Brands({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="brands" aria-labelledby="brands-title" className="scroll-mt-4 bg-floor">
      <div className={`${container} grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16 lg:py-24`}>
        <div data-reveal>
          <h2 id="brands-title" className="font-display text-[2rem] leading-[0.95] uppercase sm:text-[2.6rem]">
            {dict.brands.title}
          </h2>
          <p className="mt-5 max-w-[36ch] leading-relaxed text-muted">{dict.brands.body}</p>
        </div>

        <ul className="border-t border-ink">
          {brands.map((brand) => {
            const count = productsByBrand(brand.name).length;
            return (
              <li
                key={brand.name}
                data-reveal
                className="group relative flex flex-col gap-2 border-b border-ink/15 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:py-6"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p
                    className={`font-display text-[1.7rem] leading-none uppercase sm:text-[2.1rem] lg:text-[2.4rem] ${
                      count > 0 ? "transition-transform duration-300 ease-out-strong group-hover:translate-x-2" : ""
                    }`}
                  >
                    {brand.name}
                  </p>
                  {brand.comingSoon && (
                    <span className="rounded-sm bg-ink px-2 py-1 text-[0.72rem] font-semibold tracking-wider text-paper uppercase">
                      {dict.brands.comingSoon}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 sm:items-end sm:text-right">
                  <p className="text-muted">{pick(brand.note, locale)}</p>
                  {count > 0 && (
                    <Link
                      href={`/${locale}/products?brand=${encodeURIComponent(brand.name)}`}
                      className="inline-flex h-11 items-center gap-2 text-[0.95rem] font-semibold after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-orange"
                    >
                      <span className="underline decoration-line decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                        {dict.brands.viewRange}
                      </span>
                      <span className="tabular font-normal text-muted">{plural(locale, dict.directory.count, count)}</span>
                      <ArrowRight className="size-4 transition-transform duration-200 ease-out-strong group-hover:translate-x-1" aria-hidden />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
          <li data-reveal className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:py-8">
            <div>
              <p className="text-[1.05rem] font-semibold">{dict.brands.more}</p>
              <p className="mt-1 max-w-[42ch] text-sm leading-relaxed text-muted">{dict.brands.moreBody}</p>
            </div>
            <a
              href={generalEnquiryUrl(locale)}
              target="_blank"
              rel="noopener"
              className={`${button.outline} shrink-0 self-start sm:self-auto`}
            >
              <WhatsAppIcon className="size-4 text-[#128c4b]" />
              {dict.whatsapp.cta}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
