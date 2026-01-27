'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function useLogout() {
  const router = useRouter();
  const { setUser, setRole } = useAuth();

  const logout = async () => {
    try {
      // 1. Sign out dari Supabase
      await supabase.auth.signOut();

      // 2. Clear auth state global (React Context)
      setUser(null);
      setRole(null);

      // 3. Hapus cookie 'token' manual (PENTING untuk Middleware Anda)
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // 4. Refresh router Next.js (TAMBAHAN PENTING)
      // Ini memaksa Next.js menghapus cache sisi klien (Client Cache)
      // dan memverifikasi ulang ke server (Middleware akan berjalan lagi)
      router.refresh();

      // 5. Redirect ke login
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout: ' + error.message);
    }
  };

  return { logout };
}