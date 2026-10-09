import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { format } from "@/lib/i18n/format";
import { type Product, sizeSummary } from "@/lib/products";
import { pick } from "@/lib/site";
import { codeTag, photoClass, photoTransition } from "./photo-class";
import { Pictogram } from "./pictogram";
import { ProductWhatsAppLink } from "./product-whatsapp-link";
import { WhatsAppIcon } from "./whatsapp-icon";

/** Product art: the real photo when there is one, otherwise the pictogram. */
export function ProductArt({
  product,
  sizes,
  className = "",
  priority,
}: {
  product: Product;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!product.image) {
    return (
      <div className={`relative overflow-hidden bg-floor [--pict-bg:var(--color-floor)] ${className}`}>
        <Pictogram name={product.pictogram} className="absolute inset-x-[14%] inset-y-[16%] h-auto w-[72%] text-ink" />
      </div>
    );
  }
  return (
    <ViewTransition name={photoTransition(product.slug)} share="product-photo" default="none">
      <div className={`tile-photo relative overflow-hidden bg-floor ${className}`}>
        <Image src={product.image} alt="" fill sizes={sizes} priority={priority} quality={85} className={photoClass(product.imageFit)} />
      </div>
    </ViewTransition>
  );
}

export function ProductTile({
  product,
  locale,
  dict,
  priority,
  headingLevel = "h3",
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
  /** h2 when the tile sits directly under the page's h1 (the catalogue). */
  headingLevel?: "h2" | "h3";
}) {
  const name = pick(product.name, locale);
  const Heading = headingLevel;
  const meta = [product.brand, sizeSummary(product, locale)].filter(Boolean).join(" · ");
  const href = `/${locale}/products/${product.slug}`;

  return (
    <article className="group relative flex w-full flex-col border border-line bg-paper transition-colors duration-200 hover:border-ink">
      <div className="relative">
        <ProductArt
          product={product}
          priority={priority}
          sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 92vw"
          className="aspect-[16/10] transition-colors duration-200 group-hover:bg-floor-2 group-hover:[--pict-bg:var(--color-floor-2)] sm:aspect-[4/3]"
        />
        <span className={`${codeTag} top-2.5 left-2.5 text-[0.72rem]`}>{product.code}</span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Heading className="text-[1.02rem] leading-snug font-semibold">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-orange">
            {name}
          </Link>
        </Heading>
        {meta && <p className="tabular mt-1.5 text-sm text-muted">{meta}</p>}
        <div className="mt-auto flex items-center gap-3 pt-5">
          <ProductWhatsAppLink
            locale={locale}
            name={name}
            code={product.code}
            slug={product.slug}
            label={format(dict.whatsapp.askAbout, { name })}
            className="relative z-10 inline-flex h-11 items-center gap-2 rounded-full bg-ink pr-4 pl-3 text-sm font-semibold text-paper transition-[background-color,transform] duration-150 ease-out-strong hover:bg-ink-2 active:scale-[0.97]"
          >
            <WhatsAppIcon className="size-[1.15rem] text-whatsapp" />
            {dict.whatsapp.short}
          </ProductWhatsAppLink>
          <span
            aria-hidden
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-[background-color,border-color,color] duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
          >
            <ArrowRight className="size-[1.1rem] transition-transform duration-300 ease-out-strong group-hover:-rotate-45" />
          </span>
        </div>
      </div>
    </article>
  );
}
