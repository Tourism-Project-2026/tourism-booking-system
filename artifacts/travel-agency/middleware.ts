import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";

/**
 * Routes that require a valid admin session.
 * Add/remove prefixes here to adjust the protection scope.
 */
const PROTECTED_PAGE_PREFIXES = [
  "/bookings",
  "/trips",
  "/clients",
  "/analytics",
  "/settings",
  "/admin",
];

/**
 * Portal API sub-paths that are intentionally public and must not be blocked.
 * The public booking form posts to /portal/bookings, and the auth routes
 * must be reachable before a session exists.
 */
function isPublicPortalPath(req: NextRequest): boolean {
  const { pathname } = req.nextUrl;
  const { method } = req;
  // Public booking form submission
  if (pathname === "/portal/bookings" && method === "POST") return true;
  // Auth helpers (login / logout)
  if (pathname.startsWith("/portal/auth/")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  /*
   * Easy-toggle: if ADMIN_PASSWORD is not configured in Secrets,
   * the middleware is a complete no-op. Add the secret to activate protection.
   */
  if (!adminPassword) return NextResponse.next();

  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isPortalRoute = pathname.startsWith("/portal/");

  // Not a protected path — pass through
  if (!isProtectedPage && !isPortalRoute) return NextResponse.next();

  // Public portal sub-paths — pass through
  if (isPortalRoute && isPublicPortalPath(req)) return NextResponse.next();

  // Validate session cookie
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie?.value === adminPassword) return NextResponse.next();

  // No valid session — redirect to /login, preserving the original destination
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match the protected page routes and all /portal/* API routes.
     * Exclude Next.js internals and static assets automatically via the
     * negative lookahead so the matcher stays fast.
     */
    "/((?!_next/static|_next/image|favicon.ico|login).*)",
  ],
};
