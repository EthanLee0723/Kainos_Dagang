import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { WeeklyHours } from "../hours";
import type { Pictogram } from "../products";
import type { Localized } from "../site";

/*
 * THE DATABASE.
 * Everything the client edits in /admin lives here. Text shown on the site is
 * stored as { en, ms, zh }; every list has a `position` so the admin decides
 * its order. Columns are snake_case in Postgres (see `casing` in lib/db).
 */

const localized = () => jsonb().$type<Localized>().notNull();
const position = () => integer().notNull().default(0);
const stringList = () => jsonb().$type<string[]>().notNull().default([]);
const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
};

/** Company contact details: a single row (id 1). */
export const settings = pgTable("settings", {
  id: integer().primaryKey().default(1),
  legalName: text().notNull(),
  registration: text().notNull(),
  email: text().notNull(),
  /** The main line as written on the site ("019-662 8919"); WhatsApp and tel: links are derived from it. */
  phone: text().notNull(),
  /** Official profiles (Google Business Profile, Facebook...), linked from the structured data. */
  sameAs: stringList(),
  updatedAt: timestamps.updatedAt,
});

export const branches = pgTable("branches", {
  id: uuid().primaryKey().defaultRandom(),
  /** Stable key used in structured data ids ("taman-equine"). */
  slug: text().notNull().unique(),
  name: text().notNull(),
  area: localized(),
  phone: text().notNull(),
  addressLines: stringList(),
  street: text().notNull(),
  locality: text().notNull(),
  postalCode: text().notNull(),
  mapsUrl: text(),
  hours: jsonb().$type<WeeklyHours>().notNull(),
  position: position(),
});

export const categories = pgTable("categories", {
  /** Also the catalogue's ?category= value, so it is fixed once created. */
  id: text().primaryKey(),
  name: localized(),
  blurb: localized(),
  pictogram: text().$type<Pictogram>().notNull(),
  position: position(),
});

export const brands = pgTable("brands", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  note: localized(),
  comingSoon: boolean().notNull().default(false),
  position: position(),
});

export const colours = pgTable("colours", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized(),
  position: position(),
});

/** A size system ("UK size", "EU size", "S–XL") and every size it can come in. */
export const sizeCharts = pgTable("size_charts", {
  id: uuid().primaryKey().defaultRandom(),
  label: localized(),
  values: stringList(),
  position: position(),
});

/** The "Suitable for" chips on a product page (Construction, Factory...). */
export const suitableFor = pgTable("suitable_for", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized(),
  position: position(),
});

/** Badges such as "New" or "Best seller", shown on tiles and filterable in the catalogue. */
export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: localized(),
  position: position(),
});

export const products = pgTable(
  "products",
  {
    id: uuid().primaryKey().defaultRandom(),
    /** The product page URL; set from the code when the product is created, then fixed. */
    slug: text().notNull().unique(),
    code: text().notNull(),
    brandId: uuid().references(() => brands.id, { onDelete: "restrict" }),
    categoryId: text()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict", onUpdate: "cascade" }),
    name: localized(),
    summary: localized(),
    description: localized(),
    pack: jsonb().$type<Localized>(),
    pictogram: text().$type<Pictogram>().notNull(),
    sizeChartId: uuid().references(() => sizeCharts.id, { onDelete: "set null" }),
    /** The chart's sizes this product comes in. */
    sizes: stringList(),
    featured: boolean().notNull().default(false),
    visible: boolean().notNull().default(true),
    imageFit: text().$type<"contain" | "cover">().notNull().default("contain"),
    position: position(),
    ...timestamps,
  },
  (t) => [index().on(t.categoryId), index().on(t.brandId)],
);

const productId = () =>
  uuid()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" });

export const productFeatures = pgTable(
  "product_features",
  { id: uuid().primaryKey().defaultRandom(), productId: productId(), text: localized(), position: position() },
  (t) => [index().on(t.productId)],
);

/** Product photos in gallery order; the first is the main photo. */
export const productPhotos = pgTable(
  "product_photos",
  { id: uuid().primaryKey().defaultRandom(), productId: productId(), url: text().notNull(), position: position() },
  (t) => [index().on(t.productId)],
);

export const productColours = pgTable(
  "product_colours",
  {
    productId: productId(),
    colourId: uuid()
      .notNull()
      .references(() => colours.id, { onDelete: "cascade" }),
    position: position(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.colourId] })],
);

export const productSuitableFor = pgTable(
  "product_suitable_for",
  {
    productId: productId(),
    suitableForId: uuid()
      .notNull()
      .references(() => suitableFor.id, { onDelete: "cascade" }),
    position: position(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.suitableForId] })],
);

export const productTags = pgTable(
  "product_tags",
  {
    productId: productId(),
    tagId: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    position: position(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.tagId] })],
);

/** Failed admin logins, for throttling. */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial().primaryKey(),
    ip: text().notNull(),
    at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.ip, t.at)],
);
