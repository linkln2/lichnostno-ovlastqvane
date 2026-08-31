import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed middleware → proxy. This runs on the Node.js runtime before routes.
// Note: proxy is for routing/redirects only — real auth checks happen in layout/page server code.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("payload-token")?.value;

  // /login no longer exists — redirect to /membership
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }

  // Protect /dashboard — send to membership if not authenticated
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }

  // Protect member-only routes
  if (
    (pathname === "/inner-circle" || pathname.startsWith("/inner-circle/")) && !token
  ) {
    return NextResponse.redirect(new URL("/membership", request.url));
  }
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/membership", request.url));
    }
  }

  // After login, /admin root → /dashboard
  if (pathname === "/admin" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/inner-circle/:path*",
    "/account/:path*",
    "/login/:path*",
  ],
};
