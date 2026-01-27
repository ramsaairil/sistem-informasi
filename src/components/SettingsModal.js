'use client';

import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';
import SettingsContent from './SettingsContent';
import { User, Settings, LogOut, X, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsModal({ open, onClose }) {
  const { logout } = useLogout();
  
  const [activeTab, setActiveTab] = useState('account');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  if (!open) return null;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Password baru tidak cocok' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Password berhasil diubah' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.message || 'Gagal mengubah password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* SIDEBAR */}
        <div className="w-64 bg-[#F7F7F5] border-r border-gray-200 flex flex-col p-3 text-sm text-gray-600">
          
          <div className="mb-4">
            <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 mb-1">Account</h3>
            
            <SidebarItem 
              label="My account" 
              active={activeTab === 'account'} 
              onClick={() => setActiveTab('account')}
              icon={<User size={16} />}
            />
          </div>

          <div className="mb-4">
            <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 mb-1">Settings</h3>
            
            <SidebarItem 
              label="General" 
              active={activeTab === 'general'} 
              onClick={() => setActiveTab('general')}
              icon={<Settings size={16} />}
            />
          </div>

          <div className="mt-auto border-t border-gray-200 pt-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col bg-white relative">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-12">
            {activeTab === 'account' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">My account</h1>
                <SettingsContent />
              </div>
            )}

            {activeTab === 'general' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h1>
                
                {/* Ganti Password Section */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Ganti Password</h2>
                  
                  {passwordMessage.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${
                      passwordMessage.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {passwordMessage.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan password saat ini"
                        disabled={passwordLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan password baru"
                        disabled={passwordLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Konfirmasi password baru"
                        disabled={passwordLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function SidebarItem({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md mb-0.5 text-sm transition-colors ${
        active 
          ? "bg-[#EFEFED] text-gray-900 font-medium" 
          : "text-gray-600 hover:bg-[#EFEFED]"
      }`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}