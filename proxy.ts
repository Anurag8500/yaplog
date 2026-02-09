import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // Check for session token (works for both dev and prod environments)
  // Auth.js v5 uses "authjs.session-token" or "__Secure-authjs.session-token"
  const sessionToken = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value

  const { pathname } = request.nextUrl

  // If user is logged in, redirect away from auth pages
  if (sessionToken) {
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/dashboard/home", request.url))
    }
  }

  // If user is NOT logged in, block access to dashboard routes
  if (!sessionToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
