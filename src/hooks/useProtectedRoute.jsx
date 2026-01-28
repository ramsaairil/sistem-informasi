'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useProtectedRoute(requiredRole = null) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Role Enforcement:
    // Jika user punya role tapi tidak sesuai dengan halaman yang diakses
    if (requiredRole && role !== requiredRole) {
      const target = role === 'Admin' ? '/admin' : '/dashboard';
      router.replace(target);
    }
  }, [user, role, loading, requiredRole, router]);

  return { isAuthed: !!user, role, loading };
}