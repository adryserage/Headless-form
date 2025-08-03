import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Check if user is authenticated using NextAuth JWT (Edge Runtime compatible)
  console.log(`[Middleware] Checking authentication for: ${pathname}`);
  
  try {
    // Get and validate the JWT token (Edge Runtime compatible)
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || '',
      salt: 'authjs.session-token'
    });

    console.log(`[Middleware] Valid token found:`, !!token);

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
    "/((?!api|_next/static|_next/image|favicon.ico|check-email|.*\\.svg$).*)",
  ],
};