import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Check if user is authenticated using JWT tokens (Edge Runtime compatible)
  console.log(`[Middleware] Checking authentication for: ${pathname}`);
  
  try {
    // Get and validate the JWT token (Edge Runtime compatible)
    const secret = process.env.NEXTAUTH_SECRET;
    
    if (!secret) {
      console.error(`[Middleware] NEXTAUTH_SECRET is not defined`);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const token = await getToken({ 
      req: request, 
      secret: secret,
      salt: "authjs.session-token",
    });

    console.log(`[Middleware] Valid token found:`, !!token);
    if (token) {
      console.log(`[Middleware] Token details:`, { 
        id: token.id, 
        email: token.email,
        exp: token.exp 
      });
    }

    // If no valid token, redirect to login
    if (!token) {
      console.log(`[Middleware] No valid token, redirecting to login`);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[Middleware] Authentication successful, allowing access`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error validating token:`, error);
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