'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`
        flex items-center gap-3 p-2 w-full rounded-lg 
        bg-transparent hover:bg-sidebar-accent/10 transition-colors
        ${isCollapsed ? 'justify-center' : 'justify-start'}
      `}
      title="Toggle Theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
        <Sun className="absolute w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-sidebar-foreground" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sidebar-foreground" />
      </div>
      {!isCollapsed && (
        <span className="text-sm font-medium text-sidebar-foreground">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
