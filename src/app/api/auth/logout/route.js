import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sign out dari Supabase
    await supabase.auth.signOut();

    // Hapus token dari cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('token', '', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
