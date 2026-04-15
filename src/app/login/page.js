'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Buat instance supabase dengan browser client (agar session tersimpan dalam cookie yg bisa dibaca middleware)
  const supabase = createSupabaseBrowserClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. LOGIN KE SUPABASE
      // createBrowserClient otomatis menyimpan session sebagai cookie sb-*-auth-token
      // yang dapat dibaca oleh middleware (createServerClient dari @supabase/ssr)
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. AMBIL ROLE
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = profile?.role?.toLowerCase() || 'dosen';
      const nextUrl = searchParams.get('next');
      
      // 3. TENTUKAN TUJUAN
      let destination = userRole === 'admin' ? '/admin' : '/dashboard';
      if (userRole !== 'admin' && nextUrl) {
        destination = nextUrl;
      }

      // 4. REDIRECT — gunakan window.location.href agar cookies sudah tertulis sebelum navigasi
      window.location.href = destination;
 
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
      setIsLoading(false);
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Login</h1>
          <p className="text-sm text-gray-500">Sistem Informasi</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email*</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Password*</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-end text-xs text-gray-500">
            <Link href="#" className="hover:underline">Lupa password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black transition
              ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-400">
          Butuh bantuan? <Link href="#" className="underline hover:text-gray-600">Hubungi admin</Link>
        </p>
      </div>
    </div>
  );
}