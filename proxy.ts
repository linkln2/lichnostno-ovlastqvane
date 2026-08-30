import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed middleware → proxy. This runs on the edge before routes.
// Auth flow:
//   1. Visit /dashboard without a Payload session → redirect to /login
//   2. Custom login page checks email against whitelist
//      - Whitelisted: authenticates via /api/auth/login, redirects to /dashboard
//      - Not whitelisted: shows "coming soon" gate
//   3. /admin root with session → redirect to /dashboard (our custom dashboard)
//
// The token-presence check is a lightweight edge guard. Real auth verification
// happens when the dashboard fetches data from Payload's API (RBAC enforced there).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("payload-token")?.value;

  // Protect /dashboard — send to custom login if not authenticated
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // After login, /admin root → /dashboard (our custom dashboard)
  // Sub-routes like /admin/collections/* stay accessible for CRUD
  if (pathname === "/admin" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
