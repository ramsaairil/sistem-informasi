'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Building2, 
  Bell, 
  ArrowRight, 
  Clock, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Zap
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
        let activeRoomNames = [];
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
        setJadwal(processedJadwal.slice(0, 5)); 
        setRuangan(processedRuangan.slice(0, 5)); 

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#37352f] mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-[#787774]">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Stat Card 1 */}
          <Link href="/dashboard/jadwal" className="group">
            <div className="bg-white border border-[#E9E9E7] rounded-[4px] p-4 hover:shadow-md hover:border-[#D9D9D5] transition-all duration-200 cursor-pointer" style={{ boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-[3px] bg-[#D3E5EF] flex items-center justify-center text-[#1B4B66]">
                  <Calendar size={16} />
                </div>
              </div>
              <p className="text-[11px] text-[#787774] font-medium mb-1">Jadwal Hari Ini</p>
              <h3 className="text-2xl font-bold text-[#37352f]">{stats.jadwalHariIni}</h3>
              <p className="text-[10px] text-[#9B9A97] mt-1">Kelas terjadwal</p>
            </div>
          </Link>

          {/* Stat Card 2 */}
          <Link href="/dashboard/ruangan" className="group">
            <div className="bg-white border border-[#E9E9E7] rounded-[4px] p-4 hover:shadow-md hover:border-[#D9D9D5] transition-all duration-200 cursor-pointer" style={{ boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-[3px] bg-[#D3EBD5] flex items-center justify-center text-[#1B6B33]">
                  <Building2 size={16} />
                </div>
              </div>
              <p className="text-[11px] text-[#787774] font-medium mb-1">Ruangan Tersedia</p>
              <h3 className="text-2xl font-bold text-[#37352f]">{stats.ruanganTersedia}</h3>
              <p className="text-[10px] text-[#9B9A97] mt-1">Siap digunakan</p>
            </div>
          </Link>

          {/* Stat Card 3 */}
          <Link href="/dashboard/notifikasi" className="group">
            <div className="bg-white border border-[#E9E9E7] rounded-[4px] p-4 hover:shadow-md hover:border-[#D9D9D5] transition-all duration-200 cursor-pointer" style={{ boxShadow: "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-[3px] bg-[#F3E8D4] flex items-center justify-center text-[#9B4A09]">
                  <Bell size={16} />
                </div>
                {stats.notifBelumBaca > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </div>
              <p className="text-[11px] text-[#787774] font-medium mb-1">Notifikasi Baru</p>
              <h3 className="text-2xl font-bold text-[#37352f]">{stats.notifBelumBaca}</h3>
              <p className="text-[10px] text-[#9B9A97] mt-1">Pesan belum dibaca</p>
            </div>
          </Link>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Clock size={18} className="text-gray-600" />
                    Jadwal Hari Ini
                  </h2>
                </div>
                <Link href="/dashboard/jadwal" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition">
                  Lihat Semua
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              {/* Content */}
              <div className="flex-1 divide-y divide-gray-100">
                {jadwal.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Tidak ada jadwal hari ini</p>
                  </div>
                ) : (
                  jadwal.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Time Badge */}
                          <div className="flex-shrink-0">
                            <div className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-md text-center min-w-[90px]">
                              {item.jam_mulai?.slice(0,5)}
                            </div>
                          </div>
                          
                          {/* Schedule Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-950 transition">
                              {item.nama_peminjam || item.keterangan}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin size={14} />
                              {item.ruangan}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                          ${item.computedStatus === 'Selesai' 
                            ? 'bg-gray-100 text-gray-600' 
                            : item.computedStatus === 'Sedang Berlangsung' 
                            ? 'bg-green-100 text-green-700 animate-pulse' 
                            : 'bg-blue-100 text-blue-700'}
                        `}>
                          {item.computedStatus === 'Sedang Berlangsung' && <span className="inline-block w-1.5 h-1.5 bg-current rounded-full mr-1"></span>}
                          {item.computedStatus}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Rooms */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 size={18} className="text-gray-600" />
                  Status Ruangan
                </h2>
                <Link href="/dashboard/ruangan" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                  Cek Semua
                </Link>
              </div>
              
              {/* Content */}
              <div className="flex-1 divide-y divide-gray-100">
                {ruangan.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Building2 size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Belum ada data ruangan</p>
                  </div>
                ) : (
                  ruangan.map((room) => (
                    <div key={room.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">{room.nama}</span>
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-md transition-colors
                        ${room.status === 'Tersedia' 
                          ? 'bg-green-50 text-green-700 border border-green-200 group-hover:bg-green-100' 
                          : 'bg-red-50 text-red-700 border border-red-200 group-hover:bg-red-100'}
                      `}>
                        {room.status === 'Tersedia' ? '✓ Tersedia' : '✕ Terpakai'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}