'use client';

import SettingsContent from '@/components/SettingsContent';
import { useLogout } from '@/hooks/useLogout';
import { LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { logout } = useLogout();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Kelola profil dan keamanan akun Anda</p>
        </div>

        <div className="grid gap-6">
          
          {/* Settings Content */}
          <SettingsContent />

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition border border-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
