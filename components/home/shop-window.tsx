import Link from "next/link";
import { Bootprint } from "@/components/brand/bootprint";
import { ProductTile } from "@/components/product-tile";
import { container } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { format } from "@/lib/i18n/format";
import { featuredProducts, products } from "@/lib/products";

/** Arrowhead from the shop's metal MASUK sign. */
function MasukArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M8 4l88 46-88 46 20-46z" fill="currentColor" />
    </svg>
  );
}

/**
 * The shop floor right under the signboard: the MASUK door plaque (the way
 * into the catalogue) beside the shop window of featured products.
 */
export function ShopWindow({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section aria-labelledby="window-title" className="relative overflow-hidden bg-paper">
      <div className={`${container} py-10 sm:py-14 lg:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
          <div className="flex flex-col gap-8 lg:sticky lg:top-6 lg:self-start">
            <Link
              href={`/${locale}/products`}
              className="on-orange group @container relative flex min-h-56 flex-col justify-between overflow-hidden bg-orange p-6 text-ink sm:min-h-64"
            >
              {/* MASUK is 5.38em wide in Moderniz; with the arrow the row needs ~6.5em of the plaque's inner width. */}
              <span className="flex items-center gap-[0.22em] text-[min(4.6rem,calc((100cqw-3rem)/6.6))] leading-none">
                <span className="font-display">
                  {dict.masuk.word}
                </span>
                <MasukArrow className="size-[0.82em] shrink-0 transition-transform duration-300 ease-out-strong group-hover:translate-x-[0.12em]" />
              </span>
              <span className="relative z-10 max-w-[18rem] text-[1.05rem] leading-snug font-semibold">
                {format(dict.masuk.line, { count: products.length })}
              </span>
              <Bootprint className="pointer-events-none absolute -right-3 -bottom-10 h-44 w-auto rotate-[24deg] text-ink/10" />
              <span
                aria-hidden
                className="hazard absolute inset-x-0 bottom-0 h-2 bg-orange [--hazard-h:16px] [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-out-strong group-hover:[clip-path:inset(0_0_0_0)]"
              />
            </Link>

            <div>
              <h2 id="window-title" className="font-display text-[1.6rem] leading-tight uppercase sm:text-[1.9rem]">
                {dict.window.title}
              </h2>
              <p className="mt-3 max-w-[34ch] leading-relaxed text-muted">{dict.window.intro}</p>
              <Link
                href={`/${locale}/products`}
                className="mt-5 inline-flex h-11 items-center text-[0.95rem] font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink"
              >
                {dict.window.viewAll}
              </Link>
            </div>

            {/* Walking down the page toward the viewer: the left foot falls on screen-right. */}
            <div aria-hidden className="relative hidden h-80 text-line/70 lg:block">
              {[
                { left: true, x: "left-20", y: "top-0" },
                { left: false, x: "left-4", y: "top-[4.5rem]" },
                { left: true, x: "left-20", y: "top-36" },
                { left: false, x: "left-4", y: "top-[13.5rem]" },
              ].map((step, i) => (
                <Bootprint
                  key={i}
                  left={step.left}
                  className={`footstep absolute ${step.x} ${step.y} h-24 w-auto rotate-180`}
                />
              ))}
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <li key={product.slug} className="flex">
                <ProductTile product={product} locale={locale} dict={dict} priority={i < 4} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
