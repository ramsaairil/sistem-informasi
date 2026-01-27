'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, FileText, Send, Loader2, BookOpen } from 'lucide-react';

export default function PemesananPage() {
  const [loading, setLoading] = useState(false);
  const [listRuangan, setListRuangan] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    borrow_name: '', 
    room_name: '',    
    booking_date: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  // --- LOGIC FETCH DATA (TIDAK BERUBAH) ---
  useEffect(() => {
    const initData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

          const displayName = profile?.name || user.user_metadata?.name || user.email;
          setCurrentUser(user);
          
          setFormData(prev => ({
            ...prev,
            borrow_name: displayName 
          }));
        }

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

      const { error } = await supabase.from('bookings').insert([
        {
          borrow_name: formData.borrow_name,
          room_name: parseInt(formData.room_name),
          booking_date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          description: formData.description,
          status: 'Pending',
          user_id: currentUser.id
        }
      ]);

      if (error) throw error;

      alert('Pengajuan berhasil dikirim!');
      
      setFormData(prev => ({
        ...prev,
        room_name: '',
        booking_date: '',
        start_time: '',
        end_time: '',
        description: ''
      }));

    } catch (err) {
      console.error(err);
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container Utama: Flex Column agar Header ada di atas Form
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5] py-10 px-4 font-sans text-[#37352F]">
      
      {/* === HEADER CONTENT (Di Luar Form) === */}
      

      {/* === KOTAK FORM === */}
      <div className="w-full max-w-xl bg-white p-8 rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E1E1E0]">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilihan Ruangan */}
          <div className="group">
            <label className="block text-sm font-medium text-[#787774] mb-1.5 flex items-center gap-2">
              <FileText size={14} /> Ruangan
            </label>
            <select
              required
              name="room_name"
              value={formData.room_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#E1E1E0] rounded-md text-[#37352F] placeholder-[#9B9A97] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F] transition-all hover:bg-[#F7F7F5]"
            >
              <option value="">Pilih opsi...</option>
              {listRuangan.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div className="group">
            <label className="block text-sm font-medium text-[#787774] mb-1.5 flex items-center gap-2">
              <Calendar size={14} /> Tanggal
            </label>
            <input
              required
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#E1E1E0] rounded-md text-[#37352F] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F] transition-all hover:bg-[#F7F7F5]"
            />
          </div>

          {/* Waktu Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#787774] mb-1.5 flex items-center gap-2">
                <Clock size={14} /> Jam Mulai
              </label>
              <input
                required
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[#E1E1E0] rounded-md text-[#37352F] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F] transition-all hover:bg-[#F7F7F5]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#787774] mb-1.5 flex items-center gap-2">
                <Clock size={14} /> Jam Selesai
              </label>
              <input
                required
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[#E1E1E0] rounded-md text-[#37352F] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F] transition-all hover:bg-[#F7F7F5]"
              />
            </div>
          </div>

          {/* Keperluan */}
          <div className="group">
            <label className="block text-sm font-medium text-[#787774] mb-1.5">
              Keperluan / Deskripsi
            </label>
            <textarea
              required
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ketik detail keperluan di sini..."
              className="w-full px-3 py-2 text-sm bg-transparent border border-[#E1E1E0] rounded-md text-[#37352F] placeholder-[#9B9A97] focus:outline-none focus:border-[#37352F] focus:ring-1 focus:ring-[#37352F] transition-all hover:bg-[#F7F7F5] resize-none"
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#37352F] hover:bg-[#2F2F2F] text-white text-sm font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} />}
              {loading ? 'Menyimpan...' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}