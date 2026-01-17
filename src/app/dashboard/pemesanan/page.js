'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, FileText, Send } from 'lucide-react';

export default function PemesananPage() {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [listRuangan, setListRuangan] = useState([]); 

  // State Form
  const [formData, setFormData] = useState({
    nama_peminjam: '',
    ruangan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    keterangan: ''
  });

  // --- FETCH DATA RUANGAN (DROPDOWN) ---
  useEffect(() => {
    const fetchRuangan = async () => {
      const { data } = await supabase.from('rooms').select('nama');
      if (data) setListRuangan(data);
    };
    fetchRuangan();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          nama_peminjam: formData.nama_peminjam,
          ruangan: formData.ruangan,
          tanggal: formData.tanggal,
          jam_mulai: formData.jam_mulai,
          jam_selesai: formData.jam_selesai,
          keterangan: formData.keterangan,
          status: 'Pending'
        }
      ]);

      if (error) throw error;

      alert('Pengajuan berhasil dikirim! Silakan cek menu Riwayat untuk memantau status.');
      
      // Reset Form
      setFormData({
        nama_peminjam: '',
        ruangan: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
        keterangan: ''
      });

    } catch (err) {
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      
      <div className="w-full max-w-2xl">
        
        {/* Header Sederhana */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Buat Pesanan Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Isi formulir untuk meminjam ruangan.</p>
        </div>

        {/* Card Formulir */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nama Peminjam */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap / Organisasi</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  required
                  type="text"
                  name="nama_peminjam"
                  value={formData.nama_peminjam}
                  onChange={handleChange}
                  placeholder="Contoh: BEM Fasilkom / Ahmad Yani"
                  className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Pilihan Ruangan */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Pilih Ruangan</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  required
                  name="ruangan"
                  value={formData.ruangan}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                >
                  <option value="">-- Pilih Ruangan --</option>
                  {listRuangan.map((r, idx) => (
                    <option key={idx} value={r.nama}>{r.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Peminjaman</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  required
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Waktu (Mulai - Selesai) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jam Mulai</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jam Selesai</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="jam_selesai"
                    value={formData.jam_selesai}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Keperluan</label>
              <textarea
                required
                rows="3"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Jelaskan tujuan peminjaman secara singkat..."
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  'Sedang Mengirim...'
                ) : (
                  <>
                    <Send size={16} /> Kirim Pengajuan
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}