import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "./constants";

/*
 * One shared admin password (ADMIN_PASSWORD) and a signed, httpOnly session
 * cookie (SESSION_SECRET). Every admin page, Server Action and upload calls
 * requireAdmin()/isAdmin() itself; proxy.ts only does a quick cookie check.
 */

const WEEK = 7 * 24 * 60 * 60;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be set to 32+ random characters.");
  return new TextEncoder().encode(secret);
}

function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set.");
  return password;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/** Constant-time comparison, so response timing gives nothing away. */
export function passwordMatches(input: string) {
  return timingSafeEqual(sha256(input), sha256(adminPassword()));
}

/** Changing ADMIN_PASSWORD signs every open session out. */
function passwordVersion() {
  return sha256(`kd-admin:${adminPassword()}`).toString("base64url").slice(0, 16);
}

export async function createSession() {
  const token = await new SignJWT({ v: passwordVersion() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${WEEK}s`)
    .sign(secretKey());
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEEK,
  });
}

export async function deleteSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.v === passwordVersion();
  } catch {
    return false;
  }
}

/** For admin pages and Server Actions: anyone not signed in goes to the login page. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
