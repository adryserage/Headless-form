import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] ${request.method} ${pathname}`);

  // Allow access to auth pages and API routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/check-email") ||
    pathname.startsWith("/login") ||
    pathname.includes(".") || // Static files
    pathname === "/"
  ) {
    console.log(`[Middleware] Allowing access to: ${pathname}`);
    return NextResponse.next();
  }

  // Check if user is authenticated using NextAuth v5
  console.log(`[Middleware] Checking authentication for: ${pathname}`);
  
  try {
    const session = await auth();

    console.log(`[Middleware] Session found:`, !!session);

    // If not authenticated, redirect to login
    if (!session) {
      console.log(`[Middleware] No session, redirecting to login`);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[Middleware] Session valid, allowing access`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error checking session:`, error);
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|check-email|.*\\.svg$).*)",
  ],
};