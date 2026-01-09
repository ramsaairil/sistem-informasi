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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[360px] bg-white border border-gray-200 rounded-lg shadow-sm p-6">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            Login
          </h1>
          <p className="text-sm text-gray-500">
            Sistem Informasi Ruangan Kelas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email*
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Password*
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              Ingat saya
            </label>
            <Link href="#" className="hover:underline">
              Lupa password?
            </Link>
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
          Butuh bantuan?{' '}
          <Link href="#" className="underline hover:text-gray-600">
            Hubungi admin
          </Link>
        </p>

      </div>
    </div>
  );
}
