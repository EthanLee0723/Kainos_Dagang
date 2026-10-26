import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export { schema };

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. See .env.example.");

// Reuse one pool across hot reloads in development, unless DATABASE_URL was changed in .env.local.
const globalForDb = globalThis as unknown as { kdDb?: { url: string; sql: ReturnType<typeof postgres> } };
if (globalForDb.kdDb && globalForDb.kdDb.url !== url) {
  void globalForDb.kdDb.sql.end({ timeout: 5 });
  globalForDb.kdDb = undefined;
}
// prepare: false keeps it compatible with pooled connections (Neon's pooler, PgBouncer).
const sql = globalForDb.kdDb?.sql ?? postgres(url, { prepare: false, max: 5 });
if (process.env.NODE_ENV !== "production") globalForDb.kdDb = { url, sql };

export const db = drizzle({ client: sql, schema, casing: "snake_case" });

export type Db = typeof db;
/** A transaction handle, for helpers that run inside db.transaction(). */
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
