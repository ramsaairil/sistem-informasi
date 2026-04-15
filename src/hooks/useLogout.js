'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const supabase = createSupabaseBrowserClient();

export function useLogout() {
  const { setUser, setRole } = useAuth();

  const logout = async () => {
    try {
      // 1. Sign out dari Supabase
      await supabase.auth.signOut();

      // 2. Clear auth state global
      setUser(null);
      setRole(null);

      // 3. Hapus cookie 'token' dengan path root agar valid di semua halaman
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // 4. Hard Redirect (Ini paling ampuh menghapus cache sisa login)
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { logout };
}