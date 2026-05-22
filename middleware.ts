import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only guard /admin paths
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const session = verifySession(sessionCookie);

    const isLoginPage = pathname === "/admin/login";

    if (!session) {
      // Not authenticated
      if (!isLoginPage) {
        // Attempting to access dashboard, redirect to login page
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // Authenticated
      if (isLoginPage) {
        // Trying to visit login page while already logged in, redirect to admin dashboard
        const dashboardUrl = new URL("/admin", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
