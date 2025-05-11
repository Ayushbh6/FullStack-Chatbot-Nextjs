import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const isPublicPath = pathname === '/login';
  
  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If not authenticated and trying to access a protected route, redirect to login
  if (!token && !isPublicPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // If authenticated and trying to access login page, redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Otherwise, continue
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
};
