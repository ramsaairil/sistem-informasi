'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginCard() {
  const router = useRouter();

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
      const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. SIMPAN TOKEN KE COOKIE (Wajib agar Middleware bisa baca)
      if (session) {
        // Hapus cookie lama (jaga-jaga)
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Set cookie baru (berlaku 1 minggu)
        document.cookie = `token=${session.access_token}; path=/; max-age=604800; SameSite=Lax`;
      }

      // 3. CEK ROLE USER
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
         console.error("Error fetching profile:", profileError);
      }

      const userRole = profile?.role || 'Mahasiswa';

      // 4. REDIRECT DENGAN DELAY KECIL
      // Delay memastikan cookie sudah ter-set sebelum middleware mengecek
      setTimeout(() => {
        if (userRole === 'Admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 500);

    } catch (error) {
      setError(error.message);
      setIsLoading(false); // Matikan loading hanya jika error
    } 
    // Jika sukses, biarkan tombol tetap loading sampai halaman pindah
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg shadow-sm p-6">

        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Login</h1>
          <p className="text-sm text-gray-500">Sistem Informasi Ruangan Kelas</p>
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

          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" disabled={isLoading} />
              Ingat saya
            </label>
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