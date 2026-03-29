'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out p-4 md:p-8 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
