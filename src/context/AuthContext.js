'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil session saat refresh
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || 'User',
          email: data.user.email,
        });

        // Ambil role dari database
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        setRole(profile?.role || 'Mahasiswa');
      }
      setLoading(false);
    };

    checkAuth();

    // 2. Listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || 'User',
            email: session.user.email,
          });
          
          // Ambil role ketika auth berubah
          supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              setRole(profile?.role || 'Mahasiswa');
            });
        } else {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
