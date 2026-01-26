'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import { 
  Bell, CheckCircle2, AlertCircle, Info, Clock, CheckCheck
} from 'lucide-react';

export default function NotifikasiPage() {
  const [notif, setNotif] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. SETUP DATA & REALTIME ---
  useEffect(() => {
    let channel;

    const setupData = async () => {
      try {
        // A. Ambil User ID yang sedang login
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // B. Fetch Data Awal (History Notifikasi)
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setNotif(data || []);

          // C. Setup Realtime (Dengarkan notifikasi baru yang masuk)
          channel = supabase
            .channel('realtime-notif')
            .on(
              'postgres_changes', 
              { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${user.id}` // Hanya terima notif milik user ini
              }, 
              (payload) => {
                // Saat ada data baru masuk, tambahkan ke paling atas
                setNotif((prev) => [payload.new, ...prev]);
                
                // (Opsional) Efek Suara bisa ditaruh di sini
                console.log('Notifikasi baru diterima:', payload.new);
              }
            )
            .subscribe();
        }
      } catch (err) {
        console.error('Error setup notifikasi:', err.message);
      } finally {
        setLoading(false);
      }
    };

    setupData();

    // Cleanup: Matikan koneksi realtime saat pindah halaman agar tidak bocor
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // --- 2. TANDAI SUDAH DIBACA (Satu per satu) ---
  const markAsRead = async (id) => {
    // 1. Update UI duluan (biar terasa cepat)
    setNotif(notif.map(item => item.id === id ? { ...item, is_read: true } : item));

    // 2. Kirim update ke database
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  };

  // --- 3. TANDAI SEMUA DIBACA ---
  const markAllRead = async () => {
    // 1. Update UI semua jadi read
    setNotif(notif.map(item => ({ ...item, is_read: true })));

    // 2. Update database untuk user ini
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);
    }
  };

  // Helper: Pilih Icon berdasarkan tipe
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={20} className="text-orange-600" />;
      case 'success': return <CheckCircle2 size={20} className="text-green-600" />;
      case 'error':   return <AlertCircle size={20} className="text-red-600" />;
      default:        return <Info size={20} className="text-blue-600" />;
    }
  };

  // Helper: Format Jam (WIB)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#37352f] flex items-center gap-3">
            Notifikasi
            {/* Badge Jumlah Belum Dibaca */}
            {notif.filter(n => !n.is_read).length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {notif.filter(n => !n.is_read).length}
              </span>
            )}
          </h1>
          <p className="text-[#787774] text-sm mt-1">Pembaruan terkini seputar aktivitas kampus.</p>
        </div>

        {notif.some(n => !n.is_read) && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
          >
            <CheckCheck size={16} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* LIST NOTIFIKASI */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-[#9B9A97] animate-pulse">Memuat notifikasi...</div>
        ) : notif.length === 0 ? (
          <div className="text-center py-20 text-[#9B9A97] border-2 border-dashed border-[#E9E9E7] rounded-[4px] bg-[#FAFAF9]">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada notifikasi baru</p>
          </div>
        ) : (
          notif.map((item) => (
            <div 
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`
                relative group flex gap-4 p-4 rounded-[4px] border transition-all duration-200 cursor-pointer
                ${item.is_read 
                  ? 'bg-white border-[#E9E9E7] hover:border-[#D0CED0] opacity-90' 
                  : 'bg-[#FFFBF0] border-[#E9E9E7] hover:border-[#D0CED0] shadow-sm'
                }
              `}
            >
              {/* Indikator Belum Dibaca (Titik Biru) */}
              {!item.is_read && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm ring-2 ring-white animate-pulse" />
              )}

              {/* Icon Box */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-[3px] flex items-center justify-center transition-colors
                ${item.is_read ? 'bg-[#F5F5F4] opacity-70' : 'bg-white shadow-sm ring-1 ring-[#E9E9E7]'}
              `}>
                {getIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pr-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-semibold ${item.is_read ? 'text-[#9B9A97]' : 'text-[#37352f]'}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-[#9B9A97] flex items-center gap-1 whitespace-nowrap ml-4">
                    <Clock size={12} />
                    {formatTime(item.created_at)}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed ${item.is_read ? 'text-[#9B9A97]' : 'text-[#787774]'}`}>
                  {item.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}