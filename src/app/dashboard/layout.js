'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';

function DashboardContent({ children, openSettings, setOpenSettings }) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen">
      <Sidebar onOpenSettings={() => setOpenSettings(true)} />

      <main className={`min-h-screen transition-all duration-300 ease-in-out ${
        isOpen ? 'ml-60' : 'ml-0'
      }`}>
        {children}
      </main>

      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <SidebarProvider>
      <DashboardContent 
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      >
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
