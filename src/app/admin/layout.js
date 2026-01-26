'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function AdminLayout({ children }) {
  const { loading } = useProtectedRoute('Admin'); // Hanya bisa diakses oleh Admin

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Statis */}
      <AdminSidebar />

      {/* Konten Berubah-ubah (Page) */}
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}