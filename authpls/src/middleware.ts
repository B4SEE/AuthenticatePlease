import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/statistics',
  '/settings'
];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  
  // Check if the path requires authentication
  const requiresAuth = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (requiresAuth) {
    const authCookie = request.cookies.get('auth-session');
    
    if (!authCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
} 