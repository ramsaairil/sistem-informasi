'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, CalendarCheck, Building2, Users, LogOut, 
  CheckCircle2, XCircle, Clock, User, Trash2, Edit, Plus, X, Save
} from 'lucide-react';

// --- SIDEBAR COMPONENT ---
const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const Menu = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all mb-1
        ${activeTab === id ? 'bg-gray-200 text-black font-medium' : 'text-gray-500 hover:bg-gray-100'}
      `}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <aside className="w-64 bg-[#F7F7F5] border-r border-[#E6E6E4] h-screen fixed left-0 top-0 flex flex-col p-4 z-10">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center font-bold text-xs">A</div>
        <div>
          <div className="text-sm font-bold text-gray-900">Administrator</div>
          <div className="text-xs text-gray-500">admin@kampus.ac.id</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</div>
        <Menu id="dashboard" label="Overview" icon={LayoutDashboard} />
        <Menu id="bookings" label="Persetujuan" icon={CalendarCheck} />
        <Menu id="rooms" label="Kelola Ruangan" icon={Building2} />
        <Menu id="users" label="Kelola User" icon={Users} />
      </div>
      <div className="border-t border-gray-200 pt-4">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('bookings'); 
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0 });

  // Modal State (Untuk Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'user' atau 'room'
  const [modalMode, setModalMode] = useState(''); // 'add' atau 'edit'
  const [currentData, setCurrentData] = useState({}); // Data yang sedang diedit

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Bookings
    const { data: bookingData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (bookingData) {
      setBookings(bookingData);
      setStats({
        pending: bookingData.filter(b => b.status === 'Pending').length,
        approved: bookingData.filter(b => b.status === 'Approved').length,
      });
    }

    // Fetch Users
    const { data: userData } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
    if (userData) setUsers(userData);

    // Fetch Rooms
    const { data: roomData } = await supabase.from('rooms').select('*').order('nama', { ascending: true });
    if (roomData) setRooms(roomData);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. HANDLERS: BOOKINGS ---
  const handleBookingAction = async (id, newStatus) => {
    if (!confirm(newStatus === 'Approved' ? 'Setujui?' : 'Tolak?')) return;
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) fetchData();
  };

  // --- 3. HANDLERS: DELETE ---
  const handleDelete = async (table, id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      alert('Berhasil dihapus.');
      fetchData();
    } else {
      alert('Gagal: ' + error.message);
    }
  };

  // --- 4. HANDLERS: MODAL (ADD / EDIT) ---
  const openModal = (type, mode, data = {}) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentData(data);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Logic Simpan Room
    if (modalType === 'room') {
      const payload = {
        nama: currentData.nama,
        kapasitas: currentData.kapasitas,
        fasilitas: currentData.fasilitas
      };

      if (modalMode === 'add') {
        const { error } = await supabase.from('rooms').insert([payload]);
        if (error) alert(error.message);
      } else {
        const { error } = await supabase.from('rooms').update(payload).eq('id', currentData.id);
        if (error) alert(error.message);
      }
    }

    // Logic Simpan User (Hanya Edit)
    if (modalType === 'user' && modalMode === 'edit') {
      const { error } = await supabase.from('profiles').update({
        nama_lengkap: currentData.nama_lengkap,
        role: currentData.role
      }).eq('id', currentData.id);
      
      if (error) alert(error.message);
    }

    setIsModalOpen(false);
    fetchData();
  };

  // --- UI RENDER ---
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8">
        
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'users' ? 'Kelola Pengguna' : 
               activeTab === 'rooms' ? 'Kelola Ruangan' : 
               activeTab === 'bookings' ? 'Persetujuan Peminjaman' : 'Overview'}
            </p>
          </div>
          
          {/* Add Button (Hanya di Rooms) */}
          {activeTab === 'rooms' && (
            <button 
              onClick={() => openModal('room', 'add')}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition"
            >
              <Plus size={16} /> Tambah Ruangan
            </button>
          )}
        </div>

        {/* === TAB: BOOKINGS === */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             <div className="divide-y divide-gray-100">
              {bookings.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50">
                   <div className="flex items-start gap-4 flex-1">
                      <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${item.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                          item.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                      `}>
                        <User size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{item.nama_peminjam}</h4>
                          <span className="text-xs text-gray-400">• {item.created_at.slice(0,10)}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-0.5 font-medium">
                          {item.ruangan} <span className="text-gray-400 font-normal mx-1">|</span> {item.tanggal}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} /> {item.jam_mulai?.slice(0,5)} - {item.jam_selesai?.slice(0,5)}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      {item.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleBookingAction(item.id, 'Approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md">Setujui</button>
                          <button onClick={() => handleBookingAction(item.id, 'Rejected')} className="px-3 py-1.5 border border-gray-300 hover:bg-red-50 text-red-600 text-xs font-bold rounded-md">Tolak</button>
                        </>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">{item.status}</span>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TAB: ROOMS (CRUD) === */}
        {activeTab === 'rooms' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Nama Ruangan</th>
                  <th className="px-6 py-3">Kapasitas</th>
                  <th className="px-6 py-3">Fasilitas</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.nama}</td>
                    <td className="px-6 py-4">{r.kapasitas} Orang</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{r.fasilitas}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal('room', 'edit', r)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDelete('rooms', r.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === TAB: USERS (EDIT/DELETE) === */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.nama_lengkap}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs border ${u.role === 'Admin' ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-gray-50 border-gray-200'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal('user', 'edit', u)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDelete('profiles', u.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* === MODAL POPUP (FORM) === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Tambah' : 'Edit'} {modalType === 'room' ? 'Ruangan' : 'User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* FORM RUANGAN */}
              {modalType === 'room' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nama Ruangan</label>
                    <input 
                      required type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={currentData.nama || ''}
                      onChange={(e) => setCurrentData({...currentData, nama: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Kapasitas</label>
                    <input 
                      required type="number" 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={currentData.kapasitas || ''}
                      onChange={(e) => setCurrentData({...currentData, kapasitas: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fasilitas</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={currentData.fasilitas || ''}
                      onChange={(e) => setCurrentData({...currentData, fasilitas: e.target.value})}
                    ></textarea>
                  </div>
                </>
              )}

              {/* FORM USER (Hanya Edit) */}
              {modalType === 'user' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                      required type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={currentData.nama_lengkap || ''}
                      onChange={(e) => setCurrentData({...currentData, nama_lengkap: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      value={currentData.role || 'User'}
                      onChange={(e) => setCurrentData({...currentData, role: e.target.value})}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex justify-center items-center gap-2"
                >
                  <Save size={16} /> Simpan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}