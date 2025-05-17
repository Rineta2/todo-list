import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  // Protected routes that require authentication
  const protectedRoutes = ["/todolist", "/profile", "/home"];

  // If user is not authenticated
  if (!token) {
    // Allow access to public pages
    if (
      pathname === "/" ||
      pathname === "/signin" ||
      pathname === "/signup" ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // If trying to access protected route, redirect to signin
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", encodeURIComponent(pathname));
      return NextResponse.redirect(signinUrl);
    }

    // Allow access to all other pages
    return NextResponse.next();
  }

  // If user is authenticated
  // Redirect to todolist if trying to access auth pages
  if (pathname === "/signin" || pathname === "/signup") {
    return NextResponse.redirect(new URL("/todolist", request.url));
  }
  // Allow access to all other pages
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
};
