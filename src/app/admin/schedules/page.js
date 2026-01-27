'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, X, Save, Loader2, CalendarDays, Clock, User 
} from 'lucide-react';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // State Form Data
  const [currentData, setCurrentData] = useState({
    course_id: '',
    room_id: '',
    lecturer: '', // Nama dosen (text)
    user_id: '',  // ID dosen (uuid) - opsional untuk relasi
    date: '', 
    start_time: '',
    end_time: ''
  });
  
  const [saving, setSaving] = useState(false);
  
  // State Data Dropdown
  const [rooms, setRooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]); // State untuk list dosen

  // --- 1. FETCH DATA (Termasuk Dosen) ---
  const fetchDropdowns = async () => {
    try {
      // Ambil Ruangan
      const { data: r } = await supabase.from('rooms').select('*');
      if (r) setRooms(r);

      // Ambil Mata Kuliah
      const { data: c } = await supabase.from('courses').select('*');
      if (c) setCourses(c);

      // Ambil Dosen dari tabel 'profiles'
      const { data: l } = await supabase.from('profiles').select('id, full_name');
      if (l) setLecturers(l);

    } catch (e) { console.error("Error fetching dropdowns:", e); }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schedules')
        // Pastikan nama constraint 'schedules_room_id_fkey' benar sesuai database Anda
        .select(`*, rooms!schedules_room_id_fkey(*), courses(*)`) 
        .order('date', { ascending: true });
        
      if (error) throw error;
      setSchedules(data || []);
    } catch (err) {
      console.error("Error Schedules:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchSchedules(); 
    fetchDropdowns(); 
  }, []);

  // --- 2. ACTIONS ---
  const handleDelete = async (id) => {
    if(!confirm('Hapus jadwal ini?')) return;
    try {
      await supabase.from('schedules').delete().eq('id', id);
      fetchSchedules();
    } catch (err) { alert(err.message); }
  };

  const openModal = (mode, data = null) => {
    setModalMode(mode);
    if (mode === 'edit' && data) {
      setCurrentData(data);
    } else {
      // Reset form untuk mode tambah
      setCurrentData({
        course_id: '',
        room_id: '',
        lecturer: '',
        user_id: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '',
        end_time: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        room_id: currentData.room_id,
        course_id: currentData.course_id,
        lecturer: currentData.lecturer, // Nama disimpan sebagai text
        date: currentData.date,
        start_time: currentData.start_time,
        end_time: currentData.end_time,
        status: 'Pending' 
      };

      // Opsional: Jika tabel schedules punya kolom user_id, uncomment baris ini:
      // payload.user_id = currentData.user_id;

      if (!payload.start_time) delete payload.start_time;
      if (!payload.end_time) delete payload.end_time;

      if (modalMode === 'add') {
        const { error } = await supabase.from('schedules').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedules').update(payload).eq('id', currentData.id);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchSchedules(); 
    } catch (err) { 
      alert("Gagal menyimpan: " + err.message); 
    } finally { 
      setSaving(false); 
    }
  };

  // Helper Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Jadwal Kuliah</h1>
          <p className="text-sm text-gray-500">Atur jadwal dan dosen pengampu.</p>
        </div>
        <button onClick={() => openModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200">
          <Plus size={16}/> Tambah Jadwal
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Mata Kuliah</th>
              <th className="px-6 py-4">Ruangan</th>
              <th className="px-6 py-4">Dosen</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
            ) : schedules.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">Belum ada jadwal.</td></tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                       <CalendarDays size={16} className="text-blue-500"/> {formatDate(s.date)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 ml-6">
                       <Clock size={12}/> {s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{s.courses?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                          {s.rooms?.name || s.rooms?.nama || 'Unknown'}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                    <User size={14} className="text-gray-400"/> {s.lecturer}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal('edit', s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">{modalMode==='add'?'Tambah':'Edit'} Jadwal</h2>
              <button onClick={()=>setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
               {/* PILIHAN DROPDOWN */}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold uppercase text-gray-500">Mata Kuliah</label>
                   <select required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white outline-none" 
                       value={currentData.course_id || ''} 
                       onChange={e=>setCurrentData({...currentData, course_id:e.target.value})}>
                       <option value="">-- Pilih --</option>
                       {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-bold uppercase text-gray-500">Ruangan</label>
                   <select required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white outline-none" 
                       value={currentData.room_id || ''} 
                       onChange={e=>setCurrentData({...currentData, room_id:e.target.value})}>
                       <option value="">-- Pilih --</option>
                       {rooms.map(r=><option key={r.id} value={r.id}>{r.name || r.nama}</option>)}
                   </select>
                 </div>
               </div>
               
               {/* PILIHAN DOSEN (NEW) */}
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nama Dosen</label>
                  <select 
                    required 
                    className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white outline-none"
                    value={currentData.user_id || ''} // Menggunakan ID untuk value
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedLecturer = lecturers.find(l => l.id === selectedId);
                      
                      setCurrentData({
                        ...currentData, 
                        user_id: selectedId,
                        // Jika ketemu, ambil namanya. Jika tidak (opsi default), kosongkan.
                        lecturer: selectedLecturer ? selectedLecturer.full_name : '' 
                      });
                    }}
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {lecturers.length > 0 ? (
                      lecturers.map((dosen) => (
                        <option key={dosen.id} value={dosen.id}>
                          {dosen.full_name}
                        </option>
                      ))
                    ) : (
                       <option disabled>Data dosen kosong / belum dimuat</option>
                    )}
                  </select>
                  {/* Tampilkan nama yang terpilih untuk konfirmasi (opsional) */}
                  {currentData.lecturer && (
                    <p className="text-xs text-blue-600 mt-1">Terpilih: {currentData.lecturer}</p>
                  )}
               </div>

               {/* WAKTU */}
               <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Tanggal</label>
                    <input type="date" required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 outline-none" 
                        value={currentData.date || ''} onChange={e=>setCurrentData({...currentData, date:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Mulai</label>
                    <input type="time" required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 outline-none" 
                        value={currentData.start_time || ''} onChange={e=>setCurrentData({...currentData, start_time:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Selesai</label>
                    <input type="time" required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 outline-none" 
                        value={currentData.end_time || ''} onChange={e=>setCurrentData({...currentData, end_time:e.target.value})}/>
                  </div>
               </div>

               <button disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-blue-700 transition mt-4">
                 {saving ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Simpan Jadwal
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}