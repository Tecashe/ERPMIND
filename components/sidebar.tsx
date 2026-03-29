'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  Hammer,
  ShoppingBag,
  FileText,
  DollarSign,
  Settings,
  Menu,
  X,
  ChevronDown,
  CreditCard,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  subitems?: { name: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, href: '/dashboard' },
  { name: 'Finance & Accounting', icon: <DollarSign className="w-5 h-5" />, href: '/finance' },
  { name: 'Sales & Distribution', icon: <TrendingUp className="w-5 h-5" />, href: '/sales' },
  { name: 'Inventory Management', icon: <Package className="w-5 h-5" />, href: '/inventory' },
  { name: 'Human Resources', icon: <Users className="w-5 h-5" />, href: '/hr' },
  { name: 'Procurement', icon: <ShoppingBag className="w-5 h-5" />, href: '/procurement' },
  { name: 'Production', icon: <Hammer className="w-5 h-5" />, href: '/production' },
  { name: 'CRM', icon: <ShoppingCart className="w-5 h-5" />, href: '/crm' },
  { name: 'Fixed Assets', icon: <Package className="w-5 h-5" />, href: '/assets' },
  { name: 'Reports & Analytics', icon: <FileText className="w-5 h-5" />, href: '/reports' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
];

export function Sidebar({ 
  isCollapsed, 
  setIsCollapsed 
}: { 
  isCollapsed: boolean; 
  setIsCollapsed: (v: boolean) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-xl bg-background/80 backdrop-blur-md shadow-sm border border-border transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border
          z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed && !isOpen ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`
              flex items-center justify-center flex-shrink-0 bg-primary/10 rounded-xl
              ${isCollapsed && !isOpen ? 'w-10 h-10' : 'w-9 h-9'}
              transition-all duration-300
            `}>
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            {(!isCollapsed || isOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-300">
                <h1 className="text-sm font-bold text-foreground truncate">ProERP</h1>
                <p className="text-xs text-muted-foreground truncate tracking-wide">Kenya</p>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium
                    transition-all duration-200 overflow-hidden
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent'
                    }
                    ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`}>
                    {item.icon}
                  </div>
                  
                  {(!isCollapsed || isOpen) && (
                    <span className="truncate flex-1 text-sm">{item.name}</span>
                  )}
                </Link>

                {/* Highly Premium Tooltip for Collapsed State */}
                {isCollapsed && !isOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 pointer-events-none px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-md shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-foreground"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md flex flex-col gap-2">
          <ThemeToggle isCollapsed={isCollapsed && !isOpen} />
          
          <div className={`
            flex items-center gap-3 p-2 rounded-xl bg-muted/50 border border-border/50
            ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start'}
          `}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0 shadow-sm">
              SM
            </div>
            {(!isCollapsed || isOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">Stephen Macharia</p>
                <p className="text-xs text-muted-foreground truncate">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
