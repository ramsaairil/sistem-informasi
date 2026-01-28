'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function RiwayatPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Semua');

  // --- FETCH DATA ---
  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

      if (error) throw error;
      setData(bookings || []);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pengajuan ini?')) return;

    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      
      // Hapus item dari state tanpa reload page
      setData(data.filter((item) => item.id !== id));
      alert('Pengajuan berhasil dibatalkan.');
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // --- FILTER LOGIC ---
  const filteredData = data.filter((item) => {
    if (filterStatus === 'Semua') return true;
    return item.status === filterStatus;
  });

  // --- HELPER STATUS COLOR ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pengajuan</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar semua pengajuan peminjaman ruangan Anda.</p>
        </div>

        {/* BUTTON FILTER */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['Semua', 'Diproses', 'Disetujui', 'Ditolak'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterStatus === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT LIST */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Sedang memuat riwayat...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Search size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium">Tidak ada data ditemukan</p>
            <p className="text-sm text-gray-500">Anda belum memiliki riwayat dengan status ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* INFO KIRI */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{item.ruangan}</h3>
                    {/* Badge Status */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {item.tanggal}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Keperluan:</span> {item.keterangan}
                  </p>
                  
                  {/* Nama Peminjam (Kecil) */}
                  <div className="mt-2 text-[10px] text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">
                    Diajukan oleh: {item.nama_peminjam}
                  </div>
                </div>

                {/* AKSI KANAN */}
                {/* Tombol Hapus hanya muncul jika status masih PENDING */}
                {item.status === 'Pending' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition self-start sm:self-center"
                  >
                    <Trash2 size={14} />
                    Batalkan
                  </button>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}