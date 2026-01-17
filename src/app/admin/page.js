'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Building2, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  Users, // Icon baru untuk menu User
  Trash2,
  BadgeCheck
} from 'lucide-react';

// --- SIDEBAR ADMIN ---
const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const Menu = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all mb-1
        ${activeTab === id 
          ? 'bg-gray-200 text-black font-medium' 
          : 'text-gray-500 hover:bg-gray-100'}
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <aside className="w-64 bg-[#F7F7F5] border-r border-[#E6E6E4] h-screen fixed left-0 top-0 flex flex-col p-4">
      {/* Profile Admin */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
          A
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">Administrator</div>
          <div className="text-xs text-gray-500">admin@kampus.ac.id</div>
        </div>
      </div>

      {/* Menu Admin */}
      <div className="flex-1">
        <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</div>
        <Menu id="dashboard" label="Overview" icon={LayoutDashboard} />
        <Menu id="bookings" label="Persetujuan" icon={CalendarCheck} />
        <Menu id="rooms" label="Data Ruangan" icon={Building2} />
        
        <div className="mt-4 px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Users</div>
        {/* Menu Baru: Kelola User */}
        <Menu id="users" label="Kelola User" icon={Users} />
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 pt-4">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

// --- HALAMAN UTAMA ---
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('bookings'); 
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]); // State untuk data user
  const [stats, setStats] = useState({ pending: 0, approved: 0 });

  // 1. FETCH DATA (Booking & Users)
  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Booking
    const { data: bookingData } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingData) {
      setBookings(bookingData);
      setStats({
        pending: bookingData.filter(b => b.status === 'Pending').length,
        approved: bookingData.filter(b => b.status === 'Approved').length,
      });
    }

    // Fetch Users (Profiles)
    const { data: userData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (userData) {
      setUsers(userData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Approve/Reject Booking
  const handleBookingAction = async (id, newStatus) => {
    if (!confirm(newStatus === 'Approved' ? 'Setujui?' : 'Tolak?')) return;
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) fetchData(); // Refresh data
  };

  // 3. Handle Delete User
  const handleDeleteUser = async (id) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
      alert('User berhasil dihapus.');
    } else {
      alert('Gagal hapus: ' + error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* SIDEBAR */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CONTENT KANAN */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'users' ? 'Kelola data pengguna aplikasi.' : 'Kelola sistem peminjaman ruangan.'}
            </p>
          </div>
          
          {/* Stats hanya muncul di tab Booking/Dashboard */}
          {activeTab !== 'users' && (
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-lg text-center">
                <span className="block text-xl font-bold text-orange-600">{stats.pending}</span>
                <span className="text-xs text-orange-600 uppercase font-bold">Pending</span>
              </div>
              <div className="px-4 py-2 bg-green-50 border border-green-100 rounded-lg text-center">
                <span className="block text-xl font-bold text-green-600">{stats.approved}</span>
                <span className="text-xs text-green-600 uppercase font-bold">Disetujui</span>
              </div>
            </div>
          )}
        </div>

        {/* --- TAB: BOOKINGS (PERSETUJUAN) --- */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <CalendarCheck size={18} className="text-gray-500" />
                Daftar Permohonan Masuk
              </h3>
              <button onClick={fetchData} className="text-xs text-blue-600 hover:underline">Refresh</button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {bookings.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
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
                          <button onClick={() => handleBookingAction(item.id, 'Approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md shadow-sm">Setujui</button>
                          <button onClick={() => handleBookingAction(item.id, 'Rejected')} className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-red-50 text-gray-700 text-xs font-bold rounded-md">Tolak</button>
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

        {/* --- TAB: KELOLA USER (BARU) --- */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-gray-500" />
                Daftar Pengguna Terdaftar
              </h3>
              <div className="text-xs text-gray-500">Total: {users.length} User</div>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Nama Lengkap</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-400">Belum ada data user.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {u.nama_lengkap?.[0] || 'U'}
                        </div>
                        {u.nama_lengkap}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${u.role === 'Admin' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : u.role === 'Dosen'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-gray-100 text-gray-600 border-gray-200'}
                        `}>
                          {u.role === 'Admin' && <BadgeCheck size={12} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Placeholder Tab Lain */}
        {(activeTab === 'dashboard' || activeTab === 'rooms') && (
           <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
             Fitur {activeTab === 'dashboard' ? 'Overview Dashboard' : 'Manajemen Ruangan'} belum tersedia.
           </div>
        )}

      </main>
    </div>
  );
}