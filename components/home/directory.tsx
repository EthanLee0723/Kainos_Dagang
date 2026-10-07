import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Pictogram } from "@/components/pictogram";
import { container } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { plural } from "@/lib/i18n/format";
import { categories, productsInCategory } from "@/lib/products";
import { pick } from "@/lib/site";

/** The store directory board: every section of the shop, lit orange on hover. */
export function Directory({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="directory" aria-labelledby="directory-title" className="bg-ink text-paper">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            id="directory-title"
            className="font-display text-[2.2rem] leading-[0.95] uppercase sm:text-[3rem] lg:text-[3.6rem]"
          >
            {dict.directory.title}
          </h2>
          <p className="max-w-md leading-relaxed text-paper/70">{dict.directory.intro}</p>
        </div>

        <ul className="mt-10 border-t border-ink-line lg:mt-14">
          {categories.map((category) => {
            const count = productsInCategory(category.id).length;
            return (
              <li key={category.id} className="border-b border-ink-line">
                <Link
                  href={`/${locale}/products?category=${category.id}`}
                  className="on-orange group grid grid-cols-[3.75rem_minmax(0,1fr)_auto] items-center gap-4 py-4 transition-colors duration-200 hover:bg-orange hover:text-ink sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:gap-6 lg:grid-cols-[6rem_minmax(0,1.15fr)_minmax(0,1fr)_9rem] lg:gap-8 lg:px-2"
                >
                  <span className="block [--pict-bg:var(--color-ink)] group-hover:[--pict-accent:var(--color-paper)] group-hover:[--pict-bg:var(--color-orange)]">
                    <Pictogram name={category.pictogram} className="h-auto w-full text-paper group-hover:text-ink" />
                  </span>
                  <span className="font-display text-[1.15rem] leading-tight uppercase sm:text-[1.6rem] lg:text-[1.9rem]">
                    {pick(category.name, locale)}
                  </span>
                  <span className="hidden text-[0.95rem] leading-relaxed text-paper/65 group-hover:text-ink/80 lg:block">
                    {pick(category.blurb, locale)}
                  </span>
                  <span className="tabular flex items-center justify-end gap-2 text-sm text-paper/65 group-hover:text-ink">
                    <span className="hidden sm:inline">{plural(locale, dict.directory.count, count)}</span>
                    <span className="sm:hidden">{count}</span>
                    <ArrowRight
                      className="size-5 transition-transform duration-200 ease-out-strong group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
