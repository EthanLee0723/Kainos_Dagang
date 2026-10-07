"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { button } from "./ui";
import { WhatsAppIcon } from "./whatsapp-icon";

export type CatalogueItem = {
  slug: string;
  category: string;
  brand?: string;
  /** Lower-cased name in every language + code + brand, for search. */
  haystack: string;
};

type Labels = {
  search: string;
  all: string;
  brand: string;
  anyBrand: string;
  category: string;
  clear: string;
  emptyTitle: string;
  emptyBody: string;
  whatsapp: string;
  results: { one: string; other: string };
};

type Props = {
  items: CatalogueItem[];
  tiles: Record<string, ReactNode>;
  categories: { id: string; name: string }[];
  brands: string[];
  labels: Labels;
  locale: string;
  whatsappHref: string;
};

function countLabel(locale: string, forms: Labels["results"], count: number) {
  const form = new Intl.PluralRules(locale).select(count) === "one" ? forms.one : forms.other;
  return form.replace("{count}", String(count));
}

const normalise = (value: string) => value.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();

/**
 * Filter by section, brand and search. Server-rendered tiles are passed in and
 * shown or hidden here, so the product data never ships to the browser twice.
 * State lives in the URL (?category=&brand=&q=) so filtered views can be shared.
 */
export function Catalogue({ items, tiles, categories, brands, labels, locale, whatsappHref }: Props) {
  const params = useSearchParams();
  const [category, setCategory] = useState(() => params.get("category") ?? "");
  const [brand, setBrand] = useState(() => params.get("brand") ?? "");
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();
  const brandId = useId();

  useEffect(() => {
    const next = new URLSearchParams();
    if (category) next.set("category", category);
    if (brand) next.set("brand", brand);
    if (query.trim()) next.set("q", query.trim());
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [category, brand, query]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  const visible = useMemo(() => {
    const terms = normalise(deferredQuery).split(" ").filter(Boolean);
    return items.filter(
      (item) =>
        (!category || item.category === category) &&
        (!brand || item.brand === brand) &&
        terms.every((term) => item.haystack.includes(term)),
    );
  }, [items, category, brand, deferredQuery]);

  const filtered = Boolean(category || brand || query);
  const reset = () => {
    setCategory("");
    setBrand("");
    setQuery("");
  };

  const chip = (active: boolean) =>
    `inline-flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-150 ${
      active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink hover:border-ink"
    }`;

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-4 border-b border-line bg-paper px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
          <div role="group" aria-label={labels.category} className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[mask-image:none]">
            <button type="button" aria-pressed={!category} onClick={() => setCategory("")} className={chip(!category)}>
              {labels.all}
              <span className="tabular text-xs opacity-60">{items.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(category === c.id ? "" : c.id)}
                className={chip(category === c.id)}
              >
                {c.name}
                <span className="tabular text-xs opacity-60">{counts.get(c.id) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {brands.length > 0 && (
              <div className="relative">
                <label htmlFor={brandId} className="sr-only">
                  {labels.brand}
                </label>
                <select
                  id={brandId}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-11 appearance-none rounded-full border border-line bg-paper pr-9 pl-4 text-sm font-semibold transition-colors hover:border-ink"
                >
                  <option value="">{labels.anyBrand}</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2">
                  <path d="M2 4.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
            )}
            <div className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
              <label htmlFor={searchId} className="sr-only">
                {labels.search}
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.search}
                autoComplete="off"
                className="h-11 w-full rounded-full border border-line bg-paper pr-4 pl-10 text-sm placeholder:text-muted hover:border-ink [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-14 items-center justify-between gap-4 py-4">
        <p className="tabular text-sm text-muted" aria-live="polite">
          {countLabel(locale, labels.results, visible.length)}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-1.5 text-sm font-semibold underline decoration-line decoration-2 hover:decoration-ink underline-offset-[6px]"
          >
            <X className="size-4" aria-hidden />
            {labels.clear}
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item) => (
            <li key={item.slug} className="flex">
              {tiles[item.slug]}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-4 border border-dashed border-ink/25 px-6 py-14 sm:px-10">
          <p className="font-display text-2xl uppercase">{labels.emptyTitle}</p>
          <p className="max-w-[44ch] leading-relaxed text-muted">{labels.emptyBody}</p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener" className={button.whatsapp}>
              <WhatsAppIcon className="size-5" />
              {labels.whatsapp}
            </a>
            <button type="button" onClick={reset} className={button.outline}>
              {labels.clear}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
