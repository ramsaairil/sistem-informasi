import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Gunakan SERVICE_ROLE_KEY untuk mem-bypass keamanan (Hanya di server side)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Pastikan variable ini ada di .env.local
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, full_name, role } = body;

    // 1. Create User di Auth Supabase
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: full_name }
    });

    if (createError) throw createError;

    // 2. Update Role di Tabel Profiles (Public)
    // Karena trigger otomatis jalan saat user dibuat, kita tinggal update role-nya
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: role, nama_lengkap: full_name })
      .eq('id', user.user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'User created successfully', user });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}