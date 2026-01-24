'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Building2, 
  Bell, 
  ArrowRight, 
  Clock, 
  MapPin 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // --- STATE DATA ---
  const [stats, setStats] = useState({
    jadwalHariIni: 0,
    ruanganTersedia: 0,
    notifBelumBaca: 0
  });
  const [jadwal, setJadwal] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Siapkan Tanggal & Jam Sekarang
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const currentTime = now.toTimeString().slice(0, 5); // Format HH:mm

        // --- A. GET NOTIFIKASI COUNT ---
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        // --- B. GET JADWAL HARI INI (Approved Only) ---
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('tanggal', todayDate) 
          .eq('status', 'Approved') 
          .order('jam_mulai', { ascending: true });

        // --- C. GET DATA RUANGAN ---
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('*')
          .limit(5);

        // --- D. OLAH DATA (Logika Status) ---
        
        // 1. Olah Status Jadwal
        let activeRoomNames = []; // Menyimpan nama ruangan yang SEDANG DIPAKAI
        let processedJadwal = [];

        if (bookingsData) {
          processedJadwal = bookingsData.map((b) => {
            let status = 'Akan Datang';
            
            if (currentTime > b.jam_selesai) {
              status = 'Selesai';
            } else if (currentTime >= b.jam_mulai && currentTime <= b.jam_selesai) {
              status = 'Sedang Berlangsung';
              activeRoomNames.push(b.ruangan); 
            }

            return { ...b, computedStatus: status };
          });
        }

        // 2. Olah Status Ruangan
        let processedRuangan = [];
        let tersediaCount = 0;

        if (roomsData) {
          processedRuangan = roomsData.map(r => {
            const isBusy = activeRoomNames.includes(r.nama);
            if (!isBusy) tersediaCount++;

            return {
              ...r,
              status: isBusy ? 'Terpakai' : 'Tersedia'
            };
          });
        }

        // --- E. SET STATE ---
        setStats({
          jadwalHariIni: bookingsData?.length || 0,
          ruanganTersedia: tersediaCount,
          notifBelumBaca: notifCount || 0
        });
        setJadwal(processedJadwal.slice(0, 3)); 
        setRuangan(processedRuangan.slice(0, 3)); 

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat Dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas akademik hari ini.</p>
      </div>

      {/* 1. KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card Jadwal */}
        <Link href="/dashboard/jadwal" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Jadwal Hari Ini</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.jadwalHariIni} Kelas</h3>
          </div>
        </Link>

        {/* Card Ruangan */}
        <Link href="/dashboard/ruangan" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-green-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ruangan Tersedia</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.ruanganTersedia} Ruang</h3>
          </div>
        </Link>

        {/* Card Notifikasi */}
        <Link href="/dashboard/notifikasi" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-orange-400 transition flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition">
            <Bell size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Belum Dibaca</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.notifBelumBaca} Pesan</h3>
          </div>
        </Link>
      </div>

      {/* 2. KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Preview Jadwal */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                Jadwal Hari Ini
              </h3>
              <Link href="/dashboard/jadwal" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {jadwal.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Tidak ada jadwal hari ini.</div>
              ) : (
                jadwal.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition gap-4">
                    <div className="flex items-start gap-4">
                      <div className="min-w-[100px] text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1.5 rounded text-center">
                        {item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.nama_peminjam || item.keterangan}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin size={12} />
                          {item.ruangan}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap text-center
                      ${item.computedStatus === 'Selesai' ? 'bg-gray-100 text-gray-500' : 
                        item.computedStatus === 'Sedang Berlangsung' ? 'bg-green-100 text-green-700 animate-pulse' : 
                        'bg-blue-50 text-blue-600'}
                    `}>
                      {item.computedStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Preview Ruangan */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Building2 size={18} className="text-gray-400" />
                Status Ruangan
              </h3>
              <Link href="/dashboard/ruangan" className="text-sm text-blue-600 hover:underline">
                Cek Semua
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {ruangan.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Belum ada data ruangan.</div>
              ) : (
                ruangan.map((room) => (
                  <div key={room.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <span className="text-sm font-medium text-gray-700">{room.nama}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md
                      ${room.status === 'Tersedia' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-red-50 text-red-600 border border-red-100'}
                    `}>
                      {room.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}