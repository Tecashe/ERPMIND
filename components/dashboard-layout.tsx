'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
      />
      <main
        className={`flex-1 min-w-0 transition-all duration-300 ease-out flex flex-col 
          ${isCollapsed ? 'md:ml-24' : 'md:ml-72'}
        `}
      >
        <Navbar toggleMobile={() => setIsMobileOpen(true)} />
        <div className="flex-1 p-4 md:p-8">
          <div className="animate-fade-in delay-150 h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
