'use client';
import React, { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { CalendarCheck, Building2, Users } from 'lucide-react';

const supabase = createSupabaseBrowserClient();
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, rooms: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: pending } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Pending');
      const { count: rooms } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setStats({ pending: pending || 0, rooms: rooms || 0, users: users || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas sistem hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/bookings" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-orange-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition"><CalendarCheck size={24} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Menunggu Persetujuan</p><h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3></div>
        </Link>
        <Link href="/admin/rooms" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-green-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition"><Building2 size={24} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Ruangan</p><h3 className="text-2xl font-bold text-gray-900">{stats.rooms}</h3></div>
        </Link>
        <Link href="/admin/users" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition"><Users size={24} /></div>
          <div><p className="text-sm text-gray-500 font-medium">Total Pengguna</p><h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3></div>
        </Link>
      </div>
    </div>
  );
}