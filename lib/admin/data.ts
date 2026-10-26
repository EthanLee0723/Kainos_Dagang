import "server-only";
import { asc, count } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { ListItem } from "@/components/admin/list-editor";
import { db, schema } from "@/lib/db";
import type { ListKind } from "./lists";

const s = schema;

/** Product counts per referenced id, e.g. how many products use each colour. */
async function usage(column: AnyPgColumn) {
  const rows = await db.select({ id: column, n: count() }).from(column.table).groupBy(column);
  return new Map(rows.map((r) => [String(r.id), r.n]));
}

/** Rows for the shared list editor, in display order, with how many products use each. */
export async function loadList(kind: ListKind): Promise<ListItem[]> {
  switch (kind) {
    case "categories": {
      const [rows, used] = await Promise.all([db.select().from(s.categories).orderBy(asc(s.categories.position)), usage(s.products.categoryId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { id: r.id, name: r.name, blurb: r.blurb, pictogram: r.pictogram } }));
    }
    case "brands": {
      const [rows, used] = await Promise.all([db.select().from(s.brands).orderBy(asc(s.brands.position)), usage(s.products.brandId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { name: r.name, note: r.note, comingSoon: r.comingSoon } }));
    }
    case "sizes": {
      const [rows, used] = await Promise.all([db.select().from(s.sizeCharts).orderBy(asc(s.sizeCharts.position)), usage(s.products.sizeChartId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { label: r.label, values: r.values.join(", ") } }));
    }
    case "colours": {
      const [rows, used] = await Promise.all([db.select().from(s.colours).orderBy(asc(s.colours.position)), usage(s.productColours.colourId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { name: r.name } }));
    }
    case "suitable-for": {
      const [rows, used] = await Promise.all([db.select().from(s.suitableFor).orderBy(asc(s.suitableFor.position)), usage(s.productSuitableFor.suitableForId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { name: r.name } }));
    }
    case "tags": {
      const [rows, used] = await Promise.all([db.select().from(s.tags).orderBy(asc(s.tags.position)), usage(s.productTags.tagId)]);
      return rows.map((r) => ({ id: r.id, usage: used.get(r.id) ?? 0, values: { name: r.name } }));
    }
  }
}
