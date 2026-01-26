'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, FileText, Send, Loader2 } from 'lucide-react';

export default function PemesananPage() {
  const [loading, setLoading] = useState(false);
  const [listRuangan, setListRuangan] = useState([]);
  
  // State untuk menyimpan data User yang login
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    borrow_name: '',  // Nanti diisi otomatis
    room_name: '',    
    booking_date: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  // 1. FETCH DATA USER & RUANGAN SAAT LOAD
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Ambil Data User yang Login
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Coba ambil nama dari tabel 'profiles' (sesuai diskusi sebelumnya)
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          // Prioritas Nama: 1. Profile DB, 2. Metadata Google, 3. Email
          const displayName = profile?.name || user.user_metadata?.name || user.email;

          setCurrentUser(user);
          
          // OTOMATIS ISI FORM NAME
          setFormData(prev => ({
            ...prev,
            borrow_name: displayName // Input nama langsung terisi
          }));
        }

        // B. Ambil Data Ruangan
        const { data: rooms } = await supabase.from('rooms').select('id, name');
        if (rooms) setListRuangan(rooms);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    initData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        alert("Sesi habis. Silakan login ulang.");
        return;
      }

      // Payload ke Database
      const { error } = await supabase.from('bookings').insert([
        {
          borrow_name: formData.borrow_name, // Menggunakan nama yang sudah otomatis terisi
          room_name: parseInt(formData.room_name),
          booking_date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          description: formData.description,
          status: 'Pending',
          user_id: currentUser.id // ID User dari state
        }
      ]);

      if (error) throw error;

      alert('Pengajuan berhasil dikirim!');
      
      // Reset Form (Kecuali nama, nama tetap dipertahankan)
      setFormData({
        borrow_name: formData.borrow_name, // Nama tidak di-reset
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
    <div className="p-6 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Formulir Peminjaman</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama Peminjam (READ ONLY) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Peminjam
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  name="borrow_name"
                  value={formData.borrow_name}
                  readOnly // <--- PENTING: User tidak bisa edit manual
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">*Nama diambil otomatis dari akun login</p>
            </div>

            {/* Pilihan Ruangan */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Pilih Ruangan
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  required
                  name="room_name"
                  value={formData.room_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tanggal Peminjaman
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  required
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Waktu */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Jam Mulai
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Jam Selesai
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    required
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Keperluan
              </label>
              <textarea
                required
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Jelaskan tujuan peminjaman..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#37352f] hover:bg-[#2e2c28] text-white font-medium py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 text-sm disabled:opacity-50 shadow-sm"
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