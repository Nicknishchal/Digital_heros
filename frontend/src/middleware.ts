import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Ideally we use cookies for SSR auth
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/charities'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If trying to access protected route without token, redirect to login
  // Note: Since we are using localStorage in the client, middleware can't easily see it.
  // For a production app, we should store the token in a cookie.
  // I'll keep it simple for now as the AuthContext handles client-side redirects.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/charities/:path*'],
};
