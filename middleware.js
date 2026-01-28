import { NextResponse } from 'next/server';

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  // 1. Jika sudah login (punya token) tapi mencoba akses login, lempar ke dashboard awal
  // Catatan: Admin nanti akan diredirect ulang oleh komponen dashboard ke /admin
  if ((pathname === '/login' || pathname === '/auth/login') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Proteksi area terlarang jika tidak punya token
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname); 
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/auth/login'],
};