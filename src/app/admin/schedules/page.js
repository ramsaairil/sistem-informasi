'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, X, Save, Loader2, CalendarDays, Clock 
} from 'lucide-react';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentData, setCurrentData] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Dropdown Data
  const [rooms, setRooms] = useState([]);
  const [courses, setCourses] = useState([]);

  // --- FETCH DATA ---
  const fetchSchedules = async () => {
    setLoading(true);
    // Relasi foreign key: rooms(nama) dan courses(name)
    const { data } = await supabase
      .from('schedules')
      .select(`*, rooms(nama), courses(name)`)
      .order('day');
    if (data) setSchedules(data);
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const { data: r } = await supabase.from('rooms').select('id, nama');
    const { data: c } = await supabase.from('courses').select('id, name');
    setRooms(r || []);
    setCourses(c || []);
  };

  useEffect(() => { fetchSchedules(); }, []);

  // --- ACTIONS ---
  const handleDelete = async (id) => {
    if(!confirm('Hapus jadwal ini?')) return;
    await supabase.from('schedules').delete().eq('id', id);
    fetchSchedules();
  };

  const openModal = (mode, data = {}) => {
    fetchDropdowns(); // Load data dulu
    setModalMode(mode);
    setCurrentData(data);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        room_id: currentData.room_id,
        course_id: currentData.course_id,
        lecturer: currentData.lecturer,
        day: currentData.day,
        start_time: currentData.start_time,
        end_time: currentData.end_time
      };

      if (modalMode === 'add') await supabase.from('schedules').insert([payload]);
      else await supabase.from('schedules').update(payload).eq('id', currentData.id);

      setIsModalOpen(false);
      fetchSchedules();
    } catch (err) { alert("Gagal: " + err.message); } 
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Jadwal Kuliah</h1>
          <p className="text-sm text-gray-500">Atur jadwal mata kuliah tetap per semester.</p>
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
              <th className="px-6 py-4">Hari & Jam</th>
              <th className="px-6 py-4">Mata Kuliah</th>
              <th className="px-6 py-4">Ruangan</th>
              <th className="px-6 py-4">Dosen</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                     <CalendarDays size={16} className="text-blue-500"/> {s.day}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 ml-6">
                     <Clock size={12}/> {s.start_time?.slice(0,5)} - {s.end_time?.slice(0,5)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{s.courses?.name || '-'}</td>
                <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                        {s.rooms?.nama || s.rooms?.name || '-'}
                    </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{s.lecturer}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal('edit', s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {schedules.length === 0 && !loading && <div className="p-10 text-center text-gray-400">Belum ada jadwal.</div>}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">{modalMode==='add'?'Tambah':'Edit'} Jadwal</h2>
              <button onClick={()=>setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Mata Kuliah</label>
                    <select required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white" 
                        value={currentData.course_id||''} onChange={e=>setCurrentData({...currentData, course_id:e.target.value})}>
                        <option value="">-- Pilih Matkul --</option>
                        {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Ruangan</label>
                    <select required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white" 
                        value={currentData.room_id||''} onChange={e=>setCurrentData({...currentData, room_id:e.target.value})}>
                        <option value="">-- Pilih Ruang --</option>
                        {rooms.map(r=><option key={r.id} value={r.id}>{r.nama || r.name}</option>)}
                    </select>
                  </div>
               </div>
               
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nama Dosen</label>
                  <input required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1" 
                    placeholder="Contoh: Dr. Budi Santoso"
                    value={currentData.lecturer||''} onChange={e=>setCurrentData({...currentData, lecturer:e.target.value})}/>
               </div>

               <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Hari</label>
                    <select className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white" 
                        value={currentData.day||'Senin'} onChange={e=>setCurrentData({...currentData, day:e.target.value})}>
                        {['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Mulai</label>
                    <input type="time" required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1" 
                        value={currentData.start_time||''} onChange={e=>setCurrentData({...currentData, start_time:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Selesai</label>
                    <input type="time" required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1" 
                        value={currentData.end_time||''} onChange={e=>setCurrentData({...currentData, end_time:e.target.value})}/>
                  </div>
               </div>

               <button disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-blue-700 transition mt-4">
                 {saving ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Simpan Data
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}