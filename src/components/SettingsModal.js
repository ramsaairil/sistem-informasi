'use client';

import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';
import SettingsContent from './SettingsContent';
import { User, Settings, LogOut, X } from 'lucide-react';

export default function SettingsModal({ open, onClose }) {
  const { logout } = useLogout();
  
  const [activeTab, setActiveTab] = useState('account');

  if (!open) return null;

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
            <SidebarItem 
              label="Change Password" 
              active={activeTab === 'password'} 
              onClick={() => setActiveTab('password')}
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

            {activeTab === 'password' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">Ganti Password</h1>
                <SettingsContent />
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