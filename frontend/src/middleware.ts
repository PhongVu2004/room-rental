import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware runs on every request for the matched paths.
// Since we are using local storage for tokens (client-side), true route protection
// is best handled client-side or by moving tokens to HTTP-only cookies.
// For now, this is a placeholder that checks for a mock cookie or redirects.

export function middleware(request: NextRequest) {
  // If using cookies for auth, check here:
  // const token = request.cookies.get('access_token')
  
  // Example: Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check if token exists
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
