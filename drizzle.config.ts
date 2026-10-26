import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Read DATABASE_URL from .env.local / .env, the same files Next.js uses.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
