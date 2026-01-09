'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';

export default function DashboardLayout({ children }) {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenSettings={() => setOpenSettings(true)} />

      <main className="flex-1">
        {children}
      </main>

      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </div>
  );
}
