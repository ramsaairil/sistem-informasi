'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  CalendarDays,
  Clock
} from 'lucide-react';

export default function NotifikasiPage() {
  // DATA DUMMY
  const [notif, setNotif] = useState([
    {
      id: 1,
      type: 'warning', // warning, success, info
      title: 'Perubahan Jadwal: Pemrograman Web',
      message: 'Kelas hari Senin dipindahkan ke Ruang Lab 2 dikarenakan AC rusak.',
      time: 'Baru saja',
      isRead: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Peminjaman Ruangan Disetujui',
      message: 'Booking Aula Serbaguna untuk tanggal 20 Okt telah disetujui Admin.',
      time: '2 jam yang lalu',
      isRead: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Pengingat: Batas Input KRS',
      message: 'Jangan lupa menyelesaikan input rencana studi sebelum Jumat ini.',
      time: 'Kemarin',
      isRead: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Dosen Berhalangan Hadir',
      message: 'Pak Budi tidak dapat mengisi kelas Basis Data hari ini.',
      time: '2 hari yang lalu',
      isRead: true,
    },
  ]);

  // Fungsi untuk menandai sudah dibaca
  const markAsRead = (id) => {
    setNotif(notif.map(item => 
      item.id === id ? { ...item, isRead: true } : item
    ));
  };

  // Fungsi tandai semua sudah dibaca
  const markAllRead = () => {
    setNotif(notif.map(item => ({ ...item, isRead: true })));
  };

  // Helper untuk memilih Icon berdasarkan tipe
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={20} className="text-orange-600" />;
      case 'success': return <CheckCircle2 size={20} className="text-green-600" />;
      default: return <Info size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Notifikasi
            {/* Badge jumlah belum dibaca */}
            {notif.filter(n => !n.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {notif.filter(n => !n.isRead).length}
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Pembaruan terkini seputar aktivitas kampus.</p>
        </div>

        <button 
          onClick={markAllRead}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          Tandai semua dibaca
        </button>
      </div>

      {/* LIST NOTIFIKASI */}
      <div className="space-y-3">
        {notif.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            Tidak ada notifikasi baru
          </div>
        ) : (
          notif.map((item) => (
            <div 
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`
                relative group flex gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${item.isRead 
                  ? 'bg-white border-gray-100 hover:border-gray-300' 
                  : 'bg-blue-50/50 border-blue-100 hover:border-blue-200 shadow-sm'
                }
              `}
            >
              {/* Indikator Titik Biru (Unread) */}
              {!item.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600" />
              )}

              {/* Icon Box */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${item.isRead ? 'bg-gray-100 grayscale opacity-70' : 'bg-white shadow-sm'}
              `}>
                {getIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-sm font-semibold mb-1 ${item.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-4">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed ${item.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
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