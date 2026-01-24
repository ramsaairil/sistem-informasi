'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, FileText, Send, Loader2 } from 'lucide-react';

export default function PemesananPage() {
  const [loading, setLoading] = useState(false);
  const [listRuangan, setListRuangan] = useState([]); 

  // 1. PERBAIKAN STATE: Nama key disamakan persis dengan kolom Database
  const [formData, setFormData] = useState({
    borrow_name: '',  // Sesuai DB
    room_name: '',    // Sesuai DB (tipe int8/ID ruangan)
    booking_date: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  // Fetch Data Ruangan
  useEffect(() => {
    const fetchRuangan = async () => {
      const { data } = await supabase.from('rooms').select('id, name');
      if (data) setListRuangan(data);
    };
    fetchRuangan();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. AMBIL USER ID: Kita butuh tahu siapa yang login
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Sesi habis. Silakan login ulang.");
        return;
      }

      // 3. PAYLOAD LENGKAP: Masukkan room_name dan user_id
      const { error } = await supabase.from('bookings').insert([
        {
          borrow_name: formData.borrow_name,
          room_name: parseInt(formData.room_name), // Database minta int8
          booking_date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          description: formData.description,
          status: 'Pending',
          user_id: user.id // Wajib diisi sesuai screenshot DB
        }
      ]);

      if (error) throw error;

      alert('Pengajuan berhasil dikirim!');
      
      // Reset Form
      setFormData({
        borrow_name: '',
        room_name: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        description: ''
      });

    } catch (err) {
      console.error(err);
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Formulir Peminjaman</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nama Peminjam */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  required
                  type="text"
                  name="borrow_name" // Sesuai State & DB
                  value={formData.borrow_name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama peminjam"
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
                  name="room_name" // Sesuai State & DB
                  value={formData.room_name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Ruangan --</option>
                  {listRuangan.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
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
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Waktu */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jam Mulai</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan tujuan peminjaman..."
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
                {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}