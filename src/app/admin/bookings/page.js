'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, X, Clock, Calendar, User, RefreshCw, FileText } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [roomsList, setRoomsList] = useState([]); // State untuk simpan daftar nama ruangan
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA (Cara Manual agar Aman) ---
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // 1. Ambil Data Bookings (Tanpa Join, biar gak error)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // 2. Ambil Data Rooms (Untuk kamus nama)
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name');
      
      if (roomsError) throw roomsError;

      // Simpan ke state
      setBookings(bookingsData || []);
      setRoomsList(roomsData || []);

    } catch (err) {
      console.error("Gagal load data:", err.message);
      alert("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HELPER: Cari Nama Ruangan berdasarkan ID ---
  const getRoomName = (id) => {
    const room = roomsList.find(r => r.id === id);
    return room ? room.name : `ID Ruangan: ${id}`;
  };

  // --- APPROVE / REJECT ---
  const handleAction = async (id, status) => {
    const actionText = status === 'Approved' ? 'menyetujui' : 'menolak';
    if(!confirm(`Yakin ingin ${actionText} pengajuan ini?`)) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status }) 
        .eq('id', id);

      if (error) throw error;
      fetchData(); // Refresh

    } catch (err) {
      alert("Gagal update status: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Persetujuan Peminjaman</h1>
          <p className="text-sm text-gray-500">Validasi pengajuan penggunaan ruangan.</p>
        </div>
        <button onClick={fetchData} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition" title="Refresh Data">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''}/>
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-100">
        {bookings.length === 0 && !loading ? (
            <div className="p-10 text-center text-gray-400">Belum ada pengajuan masuk.</div>
        ) : (
            bookings.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
                
                {/* INFO KIRI */}
                <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 
                        ${item.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                          item.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Calendar size={20} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {/* Nama Peminjam */}
                            <h4 className="font-bold text-gray-900">{item.borrow_name || 'Tanpa Nama'}</h4>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </span>
                        </div>

                        <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
                            <span className="flex items-center gap-1">
                                <FileText size={14} className="text-gray-400"/>
                                {/* Manual Lookup Nama Ruangan */}
                                {getRoomName(item.room_name)}
                            </span>
                            <span className="text-gray-300">|</span> 
                            {/* Tanggal Booking */}
                            <span>{item.booking_date}</span>
                        </div>

                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock size={12}/> {item.start_time?.slice(0,5)} - {item.end_time?.slice(0,5)}
                        </div>

                        {item.description && (
                            <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                                "{item.description}"
                            </p>
                        )}
                    </div>
                </div>

                {/* TOMBOL KANAN (AKSI) */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.status === 'Pending' ? (
                        <>
                            <button onClick={() => handleAction(item.id, 'Approved')} 
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition">
                                <Check size={14}/> Setujui
                            </button>
                            <button onClick={() => handleAction(item.id, 'Rejected')} 
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-lg transition flex items-center gap-1">
                                <X size={14}/> Tolak
                            </button>
                        </>
                    ) : (
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2
                            ${item.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {item.status === 'Approved' ? <Check size={14}/> : <X size={14}/>}
                            {item.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                    )}
                </div>

            </div>
            ))
        )}
      </div>
    </div>
  );
}