'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Building2, 
  Users, 
  CalendarDays, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname(); // Untuk cek URL aktif
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Pastikan route login benar
  };

  // Definisikan menu dengan href (URL tujuan)
  const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Persetujuan', icon: CalendarCheck },
    { href: '/admin/schedules', label: 'Jadwal Kuliah', icon: CalendarDays },
    { href: '/admin/rooms', label: 'Data Ruangan', icon: Building2 },
    { href: '/admin/users', label: 'Data Pengguna', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <div>
          <h1 className="font-bold text-gray-800 text-sm">Admin Panel</h1>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu Utama</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Cek apakah URL aktif (misal: /admin/rooms cocok dengan item.href)
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}