'use client';

import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Building2,
  Bell,
  FileText,
  Clock,
  Settings,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ onOpenSettings }) {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();

  // LOGIKA TAMPILAN NAMA:
  // 1. Jika ada user.name, pakai itu.
  // 2. Jika tidak ada, ambil dari bagian depan email (misal: dosen1 dari dosen1@ulbi...)
  // 3. Default ke 'User'
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  
  // Ambil huruf pertama untuk Ikon
  const initial = displayName[0]?.toUpperCase();

  const Item = ({ href, label, Icon }) => (
    <a
      href={href}
      className={`
        flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition
        ${pathname === href
          ? 'bg-[#ECECEC] text-black font-medium'
          : 'text-[#5f5e5b] hover:bg-[#ECECEC]'}
      `}
    >
      <Icon size={16} className="text-gray-500" />
      {label}
    </a>
  );

  return (
    <>
      {/* Toggle Button - Fixed Position (hanya tampil saat sidebar tertutup) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed left-0 top-20 z-50 bg-white border border-[#E6E6E4] rounded-r-md p-2 hover:bg-[#F7F7F5] transition-all"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`bg-[#F7F7F5] border-r border-[#E6E6E4] flex flex-col font-sans fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'w-60' : 'w-0 -left-60'
      }`}>

      {/* --- PROFILE SECTION (Gaya Notion / Minimalis) --- */}
      <div className="flex items-center gap-2 px-3 py-2 m-2 rounded-md hover:bg-[#E3E2E0] transition group flex-shrink-0">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 flex-1 text-left"
        >
          {/* Avatar Kotak Kecil (Abu-abu) */}
          <div className="w-5 h-5 rounded-[3px] bg-[#E3E2E0] text-[#37352f] flex items-center justify-center text-xs font-medium shadow-sm">
            {initial}
          </div>

          {/* Nama User (Tanpa Email) */}
          <div className="flex-1 truncate text-sm font-medium text-[#37352f]">
            {displayName}
          </div>
        </button>
        
        {/* Icons on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1 hover:bg-[#D3D3D1] rounded transition"
          >
            <ChevronsUpDown size={14} className="text-[#9D9D9C]" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            title="Tutup Sidebar"
            className="p-1 hover:bg-[#D3D3D1] rounded transition"
          >
            <ChevronLeft size={14} className="text-[#9D9D9C]" />
          </button>
        </div>
      </div>
      {/* ----------------------------------------------- */}

      {/* MENU */}
      <div className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        <Item href="/dashboard" label="Beranda" Icon={Home} />
        <Item href="/dashboard/jadwal" label="Jadwal" Icon={Calendar} />
        <Item href="/dashboard/ruangan" label="Ruangan" Icon={Building2} />
        <Item href="/dashboard/notifikasi" label="Notifikasi" Icon={Bell} />

        <div className="mt-5 mb-2 px-2 text-xs font-semibold text-[#9D9D9C]">
          PRIVATE
        </div>

        <Item href="/dashboard/pemesanan" label="Pengajuan" Icon={FileText} />
        <Item href="/dashboard/riwayat" label="Riwayat" Icon={Clock} />
      </div>

      {/* SETTINGS */}
      <div className="p-2 border-t border-[#E6E6E4] flex-shrink-0">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm text-[#5f5e5b] hover:bg-[#ECECEC]"
        >
          <Settings size={16} className="text-gray-500" />
          Settings
        </button>
      </div>

    </aside>
    </>
  );
}