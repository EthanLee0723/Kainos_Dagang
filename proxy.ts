import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, negotiateLocale } from "@/lib/i18n/config";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

/**
 * Every page lives under /en, /ms or /zh. A path without a locale is
 * redirected to the language the visitor last picked in the switcher, or
 * else the best match for their browser's Accept-Language, falling back to
 * English.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin has no language prefix. Without a session cookie, go to the login page;
  // this is only a quick check, every admin page and action verifies the session itself.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname !== "/admin/login" && !request.cookies.has(ADMIN_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return;
  }

  const segment = pathname.split("/")[1];
  if (isLocale(segment)) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved)
    ? saved
    : negotiateLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension (icons, images, fonts).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
