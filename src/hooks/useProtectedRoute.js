'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook untuk proteksi halaman berdasarkan autentikasi
 * @param {string} requiredRole - Role yang dibutuhkan (optional)
 */
export function useProtectedRoute(requiredRole = null) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Tunggu sampai auth state ter-load

    // Jika tidak ada user, redirect ke login
    if (!user) {
      router.replace('/login');
      return;
    }

    // Jika memerlukan role tertentu dan role tidak cocok
    if (requiredRole && role !== requiredRole) {
      // Redirect ke halaman yang sesuai dengan rolenya
      if (role === 'Admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, role, loading, requiredRole, router]);

  return { isAuthed: !!user, role, loading };
}
