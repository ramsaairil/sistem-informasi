import { NextResponse } from 'next/server';

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  // 1. Redirect USER LOGIN -> DASHBOARD
  if ((pathname === '/login' || pathname === '/auth/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Redirect USER GUEST -> LOGIN (Dengan parameter ?next=...)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    const url = new URL('/login', req.url);
    // Simpan halaman yang mau diakses user (misal: /dashboard/jadwal)
    url.searchParams.set('next', pathname); 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/auth/login'],
};