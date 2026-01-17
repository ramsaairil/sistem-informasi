'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Settings, Bell, LogOut, X } from 'lucide-react';

export default function SettingsModal({ open, onClose }) {
  // Inisialisasi router
  const router = useRouter();
  
  // State untuk navigasi sidebar
  const [activeTab, setActiveTab] = useState('account');

  if (!open) return null;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      alert(error.message);
      return;
    }

    // Redirect ke Landing Page (Root '/')
    // Menggunakan replace agar user tidak bisa kembali (back) ke modal ini
    router.replace('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP (Gelap & Blur) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MAIN MODAL CONTAINER */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* --- KIRI: SIDEBAR MENU --- */}
        <div className="w-64 bg-[#F7F7F5] border-r border-gray-200 flex flex-col p-3 text-sm text-gray-600">
          
          {/* Group: Account */}
          <div className="mb-4">
            <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 mb-1">Account</h3>
            
            <SidebarItem 
              label="My account" 
              active={activeTab === 'account'} 
              onClick={() => setActiveTab('account')}
              icon={<User size={16} />}
            />
            <SidebarItem 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
              icon={<Settings size={16} />}
            />
            <SidebarItem 
              label="Notifications" 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')}
              icon={<Bell size={16} />}
            />
          </div>

          {/* Tombol Logout di Bawah Sidebar */}
          <div className="mt-auto border-t border-gray-200 pt-2">
             <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* --- KANAN: KONTEN UTAMA --- */}
        <div className="flex-1 flex flex-col bg-white relative">
          
          {/* Tombol Close (Pojok Kanan Atas Konten) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Konten Scrollable */}
          <div className="flex-1 overflow-y-auto p-12">
            
            {/* Tampilan Tab: My Account */}
            {activeTab === 'account' && (
              <div className="max-w-2xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                  <h1 className="text-xl font-semibold text-gray-900">My account</h1>
                </div>

                {/* Section: Profile Info */}
                <div className="flex items-center gap-6">
                  {/* Foto Profil */}
                  <div className="group relative">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      {/* Placeholder Avatar */}
                      <span className="text-2xl font-medium">U</span>
                    </div>
                    <button className="text-xs text-gray-500 mt-2 hover:underline">
                      Add photo
                    </button>
                  </div>

                  {/* Input Nama */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Preferred name
                    </label>
                    <input 
                      type="text" 
                      defaultValue="User"
                      className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Section: Account Security */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    Account security
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email Row */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="text-sm text-gray-900">user@example.com</div>
                      </div>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition">
                        Change email
                      </button>
                    </div>

                    {/* Password Row */}
                    <div className="flex justify-between items-center">
                      <div className="max-w-md">
                        <div className="text-xs text-gray-500 mb-1">Password</div>
                        <div className="text-sm text-gray-400">Set a permanent password to login to your account.</div>
                      </div>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition">
                        Add password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tampilan jika tab lain diklik (Placeholder) */}
            {activeTab !== 'account' && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Pengaturan {activeTab} belum tersedia.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN KECIL (Helper) ---

function SidebarItem({ label, active, onClick, icon, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md mb-0.5 text-sm transition-colors ${
        active 
          ? "bg-[#EFEFED] text-gray-900 font-medium" 
          : "text-gray-600 hover:bg-[#EFEFED]"
      } ${className}`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}