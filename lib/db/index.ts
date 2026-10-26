import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export { schema };

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. See .env.example.");
  // prepare: false keeps it compatible with pooled connections (Neon's pooler, PgBouncer).
  return postgres(url, { prepare: false, max: 5 });
}

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis as unknown as { kdSql?: ReturnType<typeof postgres> };
const sql = globalForDb.kdSql ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.kdSql = sql;

export const db = drizzle({ client: sql, schema, casing: "snake_case" });

export type Db = typeof db;
/** A transaction handle, for helpers that run inside db.transaction(). */
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
