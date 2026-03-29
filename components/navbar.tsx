'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Menu, UserCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

export function Navbar({ toggleMobile }: { toggleMobile: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  // Create breadcrumb from pathname roughly
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-20 h-16 w-full glass border-b border-border/50 flex flex-shrink-0 items-center justify-between px-4 md:px-8">
      
      <div className="flex items-center gap-4">
        {/* Mobile trigger */}
        <button 
          onClick={toggleMobile}
          className="md:hidden btn-icon"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        
        {/* Breadcrumb / Title */}
        <div className="flex flex-col">
          <h2 className="text-sm md:text-lg font-serif font-medium text-foreground tracking-tight leading-none truncate delay-75 animate-slide-right">
            {currentPage.replace('-', ' ')}
          </h2>
          <span className="hidden sm:inline-block text-[10px] md:text-xs font-semibold text-muted-foreground tracking-wider uppercase mt-1">
            ProERP Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-gold-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="input-field pl-9 h-9 w-40 lg:w-64 text-sm rounded-full bg-surface border border-border focus:border-gold-400 focus:w-48 lg:focus:w-72 transition-all duration-300 ease-smooth"
          />
        </div>

        {/* Search Mobile Trigger */}
        <button className="md:hidden btn-icon rounded-full w-9 h-9">
          <Search className="w-4 h-4 text-foreground" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-icon rounded-full w-9 h-9 border-none hover:bg-muted/80 relative flex items-center justify-center"
          title="Toggle Theme"
        >
          <Sun className="w-4 h-4 text-foreground absolute scale-100 rotate-0 transition-transform duration-300 ease-in-out dark:scale-0 dark:-rotate-90" />
          <Moon className="w-4 h-4 text-foreground absolute scale-0 rotate-90 transition-transform duration-300 ease-in-out dark:scale-100 dark:rotate-0" />
        </button>

        {/* Notifications */}
        <button className="btn-icon rounded-full relative w-9 h-9 border-none hover:bg-muted/80">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-signal-500 border-2 border-surface animate-pulse" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-border mx-2" />

        {/* Profile Avatar */}
        <button className="flex items-center gap-2 hover:bg-muted/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-border">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-obsidian-950 tracking-tighter">SM</span>
          </div>
          <span className="hidden sm:block text-xs font-semibold text-foreground tracking-tight">Macharia</span>
        </button>
      </div>
    </header>
  );
}
