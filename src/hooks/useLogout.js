'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function useLogout() {
  const router = useRouter();
  const { setUser, setRole } = useAuth();

  const logout = async () => {
    try {
      // Sign out dari Supabase
      await supabase.auth.signOut();

      // Clear auth state
      setUser(null);
      setRole(null);

      // Clear cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Redirect ke login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout: ' + error.message);
    }
  };

  return { logout };
}
