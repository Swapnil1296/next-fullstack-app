import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Export as default middleware function
export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is authenticated
  if (token) {
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'  // Exact match for root, not startsWith
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is not authenticated
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Proceed with the request if no redirect is needed
  return NextResponse.next();
}

// Configuration for matching paths
export const config = {
  matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],
};