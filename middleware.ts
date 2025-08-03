import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] ${request.method} ${pathname}`);

  // Allow access to auth pages, API routes, and static files ONLY
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/check-email") ||
    pathname.startsWith("/login") ||
    pathname.includes(".") || // Static files (css, js, images, etc)
    pathname === "/favicon.ico"
  ) {
    console.log(`[Middleware] Allowing access to: ${pathname}`);
    return NextResponse.next();
  }

  // Authentication is now enabled with GitHub OAuth as backup

  // Check if user is authenticated using NextAuth
  console.log(`[Middleware] Checking authentication for: ${pathname}`);
  
  try {
    // Get the session using NextAuth
    const session = await auth();

    console.log(`[Middleware] Valid session found:`, !!session);

    // If no valid session, redirect to login
    if (!session) {
      console.log(`[Middleware] No valid session, redirecting to login`);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[Middleware] Authentication successful, allowing access`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error validating session:`, error);
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files (images, etc)
     */
    "/((?!api|_next|.*\\.).*)",
  ],
};