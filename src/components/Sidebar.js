'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Building2,
  Bell,
  FileText,
  Clock,
  Settings
} from 'lucide-react';

export default function Sidebar({ onOpenSettings }) {
  const pathname = usePathname();
  const { user } = useAuth();

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
    <aside className="w-60 h-screen bg-[#F7F7F5] border-r border-[#E6E6E4] flex flex-col">

      {/* PROFILE */}
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-3 px-3 py-3 m-2 rounded-md hover:bg-[#ECECEC] transition text-left"
      >
        <div className="w-8 h-8 rounded-md bg-orange-600 text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.[0] ?? 'U'}
        </div>

        <div className="leading-tight">
          <div className="text-sm font-medium truncate">
            {user?.name ?? 'User'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {user?.email ?? 'user@email.com'}
          </div>
        </div>
      </button>

      {/* MENU */}
      <div className="flex-1 px-2 py-3 space-y-1">
        <Item href="/dashboard" label="Home" Icon={Home} />
        <Item href="/dashboard/jadwal" label="Jadwal" Icon={Calendar} />
        <Item href="/dashboard/ruangan" label="Ruangan" Icon={Building2} />
        <Item href="/dashboard/notifikasi" label="Notifikasi" Icon={Bell} />

        <div className="mt-4 mb-1 px-2 text-xs font-semibold text-gray-400 uppercase">
          Private
        </div>

        <Item href="/dashboard/pemesanan" label="Pemesanan" Icon={FileText} />
        <Item href="/dashboard/riwayat" label="Riwayat" Icon={Clock} />
      </div>

      {/* SETTINGS */}
      <div className="p-2 border-t border-[#E6E6E4]">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm text-[#5f5e5b] hover:bg-[#ECECEC]"
        >
          <Settings size={16} className="text-gray-500" />
          Settings
        </button>
      </div>

    </aside>
  );
}
