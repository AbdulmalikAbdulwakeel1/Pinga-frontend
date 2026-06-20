import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const isAuthenticated = !!(accessToken || refreshToken);

  const isAuthRoute = pathname.startsWith("/auth");
  const isOwnerRoute = pathname.startsWith("/owner");
  const isAgentRoute = pathname.startsWith("/agent");

  // Authenticated users visiting auth pages -> redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    if (userRole === "agent") {
      return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  // Unauthenticated users visiting protected routes -> redirect to login
  if (!isAuthenticated && (isOwnerRoute || isAgentRoute)) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(redirectUrl);
  }

  // Owner routes for agents -> redirect to agent dashboard
  if (isAuthenticated && isOwnerRoute && userRole === "agent") {
    return NextResponse.redirect(new URL("/agent/dashboard", request.url));
  }

  // Agent routes for owners -> redirect to owner dashboard
  if (isAuthenticated && isAgentRoute && userRole === "owner") {
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  // Redirect /owner to /owner/dashboard
  if (pathname === "/owner") {
    return NextResponse.redirect(new URL("/owner/dashboard", request.url));
  }

  // Redirect /agent to /agent/dashboard
  if (pathname === "/agent") {
    return NextResponse.redirect(new URL("/agent/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
