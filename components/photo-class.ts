import type { Product } from "@/lib/products";

/**
 * Classes for a product photo: cut-outs sit on the art well, photos fill it.
 * Cut-outs keep extra room at the top so the code tag never sits on the product.
 */
export function photoClass(fit: Product["imageFit"], { tagged = true } = {}) {
  if (fit === "cover") return "object-cover";
  return `object-contain mix-blend-multiply ${tagged ? "px-5 pt-11 pb-4" : "p-1.5"}`;
}

/** The product code, as a small paper tag over the top-left of the art. */
export const codeTag =
  "font-display tabular pointer-events-none absolute z-10 rounded-sm bg-paper px-2 py-1 leading-none text-ink";

/** Shared by a tile's photo and the product page's main photo, so one morphs into the other. */
export const photoTransition = (slug: string) => `photo-${slug}`;
