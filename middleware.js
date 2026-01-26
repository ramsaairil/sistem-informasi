import { NextResponse } from 'next/server';

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  // Jika user sudah login dan mencoba akses /login atau /auth/login, redirect ke dashboard
  if ((pathname === '/login' || pathname === '/auth/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Jika user belum login dan mencoba akses /dashboard atau /admin, redirect ke login
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/auth/login'],
};
