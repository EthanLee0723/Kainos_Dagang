"use client";

import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Pictogram } from "@/components/pictogram";
import type { AdminDictionary } from "@/lib/admin/dictionaries/en";
import { plural } from "@/lib/admin/format";
import type { Pictogram as PictogramKey } from "@/lib/products";
import { card, input } from "./ui";

export type ProductRow = {
  id: string;
  code: string;
  name: string;
  /** Every language's name and the code, lower-cased, for search. */
  haystack: string;
  brand: string | null;
  categoryId: string;
  category: string;
  photo: string | null;
  pictogram: PictogramKey;
  featured: boolean;
  visible: boolean;
};

export function ProductTable({
  rows,
  categories,
  brands,
  t,
}: {
  rows: ProductRow[];
  categories: { id: string; name: string }[];
  brands: string[];
  t: AdminDictionary;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const p = t.products;

  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!category || r.categoryId === category) &&
          (!brand || (brand === "-" ? !r.brand : r.brand === brand)) &&
          q.split(/\s+/).every((term) => r.haystack.includes(term)),
      ),
    [rows, category, brand, q],
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">{p.search}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={p.search} className={`${input} pl-9`} />
        </label>
        <label>
          <span className="sr-only">{p.category}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${input} sm:w-52`}>
            <option value="">{p.allCategories}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">{p.brand}</span>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className={`${input} sm:w-48`}>
            <option value="">{p.allBrands}</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value="-">{p.noBrand}</option>
          </select>
        </label>
      </div>
      <p className="tabular mb-2 text-sm text-muted" aria-live="polite">
        {plural(p.count, visible.length)}
      </p>
      <ul className={`${card} divide-y divide-line`}>
        {visible.map((r) => (
          <li key={r.id}>
            <Link href={`/admin/products/${r.id}`} className="group flex items-center gap-3 p-2.5 pr-4 hover:bg-floor sm:gap-4">
              <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-md bg-floor [--pict-bg:var(--color-floor)]">
                {r.photo ? (
                  <Image src={r.photo} alt="" fill sizes="56px" className="object-contain mix-blend-multiply p-1" />
                ) : (
                  <Pictogram name={r.pictogram} className="h-auto w-10 text-ink" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{r.name}</span>
                <span className="tabular block truncate text-sm text-muted">
                  {[r.code, r.brand, r.category].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="hidden shrink-0 gap-1.5 sm:flex">
                {r.featured && <span className="rounded-sm bg-orange px-2 py-1 text-xs font-semibold text-ink">{p.featured}</span>}
                {!r.visible && <span className="rounded-sm bg-ink px-2 py-1 text-xs font-semibold text-paper">{p.hidden}</span>}
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted group-hover:text-ink" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
