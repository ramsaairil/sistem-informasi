import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // 1. BELUM LOGIN
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // 2. SUDAH LOGIN
  if (user) {
    // Role based check (only when needed)
    if (pathname === '/login' || pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const role = (profile?.role || 'dosen').toLowerCase();

      // Always redirect away from login if authenticated
      if (pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = role === 'admin' ? '/admin' : '/dashboard';
        return NextResponse.redirect(url);
      }

      // Admin protection
      if (pathname.startsWith('/admin') && role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};