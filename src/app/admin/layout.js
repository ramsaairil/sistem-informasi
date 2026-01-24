import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Portal',
};

export default function AdminLayout({ children }) {
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