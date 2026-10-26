"use server";

import { and, count, eq, gt, lt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { db, schema } from "@/lib/db";
import { ADMIN_LANG_COOKIE } from "../constants";
import { createSession, deleteSession, passwordMatches } from "../session";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export type LoginState = { error?: "wrong" | "locked" } | undefined;

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Sign in with the shared password. Five wrong tries from one address within 15 minutes locks it out. */
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  const since = new Date(Date.now() - WINDOW_MS);
  const attempts = schema.loginAttempts;

  // Old attempts are only kept long enough to count.
  await db.delete(attempts).where(lt(attempts.at, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const [{ failures }] = await db
    .select({ failures: count() })
    .from(attempts)
    .where(and(eq(attempts.ip, ip), gt(attempts.at, since)));
  if (failures >= MAX_FAILURES) return { error: "locked" };

  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    await db.insert(attempts).values({ ip });
    return { error: failures + 1 >= MAX_FAILURES ? "locked" : "wrong" };
  }

  await db.delete(attempts).where(eq(attempts.ip, ip));
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

/** The EN / 中文 switch. Works signed in or out (it only changes interface text). */
export async function setAdminLang(lang: "en" | "zh") {
  (await cookies()).set(ADMIN_LANG_COOKIE, lang === "zh" ? "zh" : "en", {
    path: "/admin",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  refresh();
}
