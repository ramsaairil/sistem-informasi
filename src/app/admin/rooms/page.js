'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, MapPin, X, Save, UploadCloud, Loader2 
} from 'lucide-react';

export default function RoomsPage() {
  // --- STATE ---
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentData, setCurrentData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchRooms = async () => {
    setLoading(true);
    // Select sesuai kolom database
    const { data, error } = await supabase.from('rooms').select('*').order('created_at');
    if (data) setRooms(data);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  // --- 2. DELETE ---
  const handleDelete = async (id) => {
    if(!confirm('Yakin ingin menghapus ruangan ini?')) return;
    await supabase.from('rooms').delete().eq('id', id);
    fetchRooms();
  };

  // --- 3. MODAL ---
  const openModal = (mode, data = {}) => {
    setModalMode(mode);
    setCurrentData(data);
    setImageFile(null);
    setIsModalOpen(true);
  };

  // --- 4. UPLOAD & SAVE ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) setImageFile(file);
    else alert("Maksimal 2MB");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrlToSave = currentData.image; // Pakai URL lama jika tidak upload baru

      // A. Upload Gambar ke Bucket 'image'
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `room-${Date.now()}.${fileExt}`;
        
        // PENTING: Nama bucket disesuaikan jadi 'image'
        const { error: upErr } = await supabase.storage.from('image').upload(fileName, imageFile);
        if (upErr) throw upErr;
        
        const { data } = supabase.storage.from('image').getPublicUrl(fileName);
        imageUrlToSave = data.publicUrl;
      }

      // B. Simpan ke Database (Kolom: name, description, image, status)
      const payload = {
        name: currentData.name,               // Sesuai DB
        description: currentData.description, // Sesuai DB
        image: imageUrlToSave,                // Sesuai DB
        status: currentData.status || 'Tersedia'
      };

      if (modalMode === 'add') {
        const { error } = await supabase.from('rooms').insert([payload]);
        if(error) throw error;
      } else {
        const { error } = await supabase.from('rooms').update(payload).eq('id', currentData.id);
        if(error) throw error;
      }

      setIsModalOpen(false);
      fetchRooms(); 
      alert("Data berhasil disimpan!");

    } catch (err) {
      alert("Gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Ruangan</h1>
          <p className="text-sm text-gray-500">Kelola fasilitas ruangan kampus.</p>
        </div>
        <button onClick={() => openModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200">
          <Plus size={16}/> Tambah Ruangan
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Memuat data...</div>
        ) : rooms.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Belum ada data.</div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                   {room.image ? (
                     <img src={room.image} alt={room.name} className="w-full h-full object-cover"/>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400"><MapPin size={20}/></div>
                   )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{room.name}</h4>
                  <p className="text-xs text-gray-500 max-w-md truncate">{room.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <span className={`px-2 py-1 text-xs rounded font-bold border 
                    ${room.status === 'Tersedia' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {room.status}
                 </span>
                 <div className="flex gap-1">
                    <button onClick={() => openModal('edit', room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(room.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="font-bold text-lg text-gray-900">{modalMode==='add'?'Tambah':'Edit'} Ruangan</h2>
              <button onClick={()=>setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nama Ruangan</label>
                  <input required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1" 
                    placeholder="Contoh: Lab Komputer 1"
                    value={currentData.name || ''}
                    onChange={e => setCurrentData({...currentData, name: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Foto</label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-center cursor-pointer relative">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <UploadCloud className="mx-auto text-gray-400 mb-2"/>
                    <p className="text-xs text-gray-500">{imageFile ? imageFile.name : "Klik upload gambar"}</p>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Deskripsi</label>
                  <textarea className="w-full border border-gray-300 p-2.5 rounded-lg mt-1" rows={3}
                    placeholder="Fasilitas ruangan..."
                    value={currentData.description || ''}
                    onChange={e => setCurrentData({...currentData, description: e.target.value})}
                  />
               </div>

               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Status</label>
                  <select className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white"
                    value={currentData.status || 'Tersedia'}
                    onChange={e => setCurrentData({...currentData, status: e.target.value})}
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Penuh">Penuh</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
               </div>

               <button disabled={uploading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-blue-700 mt-4">
                 {uploading ? <Loader2 className="animate-spin"/> : <Save size={18}/>} Simpan Data
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}