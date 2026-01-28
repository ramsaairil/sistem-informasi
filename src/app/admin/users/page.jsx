'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, User, X, Save, Loader2, Mail, Shield, Eye, EyeOff
} from 'lucide-react';

export default function UsersPage() {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [showPassword, setShowPassword] = useState(false);
  
  const [currentData, setCurrentData] = useState({
    id: '',
    name: '',
    email: '',
    password: '', 
    role: 'dosen' 
  });
  
  const [saving, setSaving] = useState(false);

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error("Error fetching profiles:", error.message);
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- DELETE ---
  const handleDelete = async (id) => {
    if(!confirm('Yakin hapus user ini SEPENUHNYA? Akun login juga akan dihapus.')) return;
    
    try {
      const res = await fetch(`/api/admin/delete-user?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      alert("User berhasil dihapus.");
      fetchUsers();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  // --- OPEN MODAL ---
  const openModal = (mode, data = null) => {
    setModalMode(mode);
    setShowPassword(false); 
    
    if (data) {
      setCurrentData({
        id: data.id,
        name: data.name,
        email: data.email,
        password: '', 
        role: data.role
      });
    } else {
      setCurrentData({
        id: '',
        name: '',
        email: '',
        password: '', 
        role: 'dosen'
      });
    }
    setIsModalOpen(true);
  };

  // --- SAVE DATA ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'add') {
        // Validasi Password Minimal 6 Karakter
        if (!currentData.password || currentData.password.length < 6) {
            throw new Error("Password wajib diisi dan minimal 6 karakter.");
        }

        const res = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentData.email,
            password: currentData.password,
            name: currentData.name, // SUDAH DIPERBAIKI: Menggunakan 'name' agar cocok dengan API
            role: currentData.role
          })
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal membuat user");
        }
        alert(`User berhasil dibuat!`);
      } else {
        // Edit Profile (Langsung ke Supabase Client)
        const payload = { 
          name: currentData.name, 
          role: currentData.role 
        };
        const { error } = await supabase
           .from('profiles')
           .update(payload)
           .eq('id', currentData.id);
           
        if (error) throw error;
        alert("Profil berhasil diperbarui!");
      }

      setIsModalOpen(false);
      fetchUsers(); // Refresh tabel
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500">Kelola akun Dosen dan Petugas (Admin).</p>
        </div>
        <button onClick={() => openModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200">
          <Plus size={16}/> Tambah User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={16}/>
                  </div>
                  {u.name || 'Tanpa Nama'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400"/> {u.email}
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1 capitalize
                    ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                      u.role === 'dosen' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-gray-50 text-gray-700 border-gray-100'}`}>
                    <Shield size={10}/> {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal('edit', u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && <div className="p-10 text-center text-gray-400">Tidak ada data user.</div>}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">{modalMode==='add'?'Tambah':'Edit'} User</h2>
              <button onClick={()=>setIsModalOpen(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
               
               {/* INPUT NAMA */}
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nama</label>
                  <input required className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 outline-none focus:border-blue-500 transition" 
                    value={currentData.name || ''}
                    onChange={e=>setCurrentData({...currentData, name:e.target.value})}
                    placeholder="Contoh: Budi Santoso"
                  />
               </div>
               
               {/* INPUT EMAIL */}
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                  <input required type="email" disabled={modalMode==='edit'} 
                    className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 outline-none focus:border-blue-500 transition disabled:bg-gray-100 disabled:text-gray-500" 
                    value={currentData.email || ''} 
                    onChange={e=>setCurrentData({...currentData, email:e.target.value})}
                    placeholder="user@example.com"
                  />
               </div>

               {/* INPUT PASSWORD */}
               {modalMode === 'add' && (
                 <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Password</label>
                    <div className="relative mt-1">
                        <input 
                            required 
                            type={showPassword ? "text" : "password"} 
                            className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-blue-500 transition pr-10" 
                            value={currentData.password || ''} 
                            onChange={e=>setCurrentData({...currentData, password:e.target.value})}
                            placeholder="Minimal 6 karakter"
                            minLength={6}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                 </div>
               )}
               
               {/* PILIHAN ROLE */}
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Role</label>
                  <select className="w-full border border-gray-300 p-2.5 rounded-lg mt-1 bg-white outline-none focus:border-blue-500 transition" 
                    value={currentData.role || 'dosen'} 
                    onChange={e=>setCurrentData({...currentData, role:e.target.value})}>
                    <option value="dosen">Dosen</option>
                    <option value="admin">Admin / Petugas</option>
                  </select>
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