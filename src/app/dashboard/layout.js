'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';

export default function DashboardLayout({ children }) {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar onOpenSettings={() => setOpenSettings(true)} />

      <main className="ml-60 min-h-screen">
        {children}
      </main>

      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </div>
  );
}
