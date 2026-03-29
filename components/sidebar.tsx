'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  subitems?: { name: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/dashboard',
  },
  {
    name: 'Finance & Accounting',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/finance',
    subitems: [
      { name: 'General Ledger', href: '/finance/ledger' },
      { name: 'Accounts Payable', href: '/finance/payable' },
      { name: 'Accounts Receivable', href: '/finance/receivable' },
      { name: 'Bank Reconciliation', href: '/finance/banking' },
      { name: 'Budgeting', href: '/finance/budgeting' },
      { name: 'Tax Compliance', href: '/finance/tax' },
    ],
  },
  {
    name: 'Sales & Distribution',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/sales',
    subitems: [
      { name: 'Quotations', href: '/sales/quotations' },
      { name: 'Sales Orders', href: '/sales/orders' },
      { name: 'Deliveries', href: '/sales/deliveries' },
      { name: 'Invoicing', href: '/sales/invoicing' },
      { name: 'Customer Management', href: '/sales/customers' },
    ],
  },
  {
    name: 'Inventory Management',
    icon: <Package className="w-5 h-5" />,
    href: '/inventory',
    subitems: [
      { name: 'Stock Tracking', href: '/inventory/tracking' },
      { name: 'Warehouses', href: '/inventory/warehouses' },
      { name: 'Goods Receipt', href: '/inventory/receipt' },
      { name: 'Goods Issue', href: '/inventory/issue' },
      { name: 'Stock Transfers', href: '/inventory/transfers' },
    ],
  },
  {
    name: 'Human Resources',
    icon: <Users className="w-5 h-5" />,
    href: '/hr',
    subitems: [
      { name: 'Employee Records', href: '/hr/employees' },
      { name: 'Payroll', href: '/hr/payroll' },
      { name: 'Attendance', href: '/hr/attendance' },
      { name: 'Leave Management', href: '/hr/leave' },
      { name: 'Benefits', href: '/hr/benefits' },
    ],
  },
  {
    name: 'Procurement',
    icon: <ShoppingBag className="w-5 h-5" />,
    href: '/procurement',
    subitems: [
      { name: 'Purchase Orders', href: '/procurement/orders' },
      { name: 'Supplier Management', href: '/procurement/suppliers' },
      { name: 'Purchase Requests', href: '/procurement/requests' },
      { name: 'Vendor Invoices', href: '/procurement/invoices' },
    ],
  },
  {
    name: 'Production',
    icon: <Hammer className="w-5 h-5" />,
    href: '/production',
    subitems: [
      { name: 'Manufacturing Orders', href: '/production/orders' },
      { name: 'Bill of Materials', href: '/production/bom' },
      { name: 'Work Centers', href: '/production/centers' },
      { name: 'Production Scheduling', href: '/production/scheduling' },
    ],
  },
  {
    name: 'CRM',
    icon: <ShoppingCart className="w-5 h-5" />,
    href: '/crm',
    subitems: [
      { name: 'Leads', href: '/crm/leads' },
      { name: 'Opportunities', href: '/crm/opportunities' },
      { name: 'Contacts', href: '/crm/contacts' },
      { name: 'Campaigns', href: '/crm/campaigns' },
    ],
  },
  {
    name: 'Fixed Assets',
    icon: <Package className="w-5 h-5" />,
    href: '/assets',
    subitems: [
      { name: 'Asset Register', href: '/assets/register' },
      { name: 'Depreciation', href: '/assets/depreciation' },
      { name: 'Maintenance', href: '/assets/maintenance' },
    ],
  },
  {
    name: 'Reports & Analytics',
    icon: <FileText className="w-5 h-5" />,
    href: '/reports',
    subitems: [
      { name: 'Financial Reports', href: '/reports/financial' },
      { name: 'Sales Reports', href: '/reports/sales' },
      { name: 'Inventory Reports', href: '/reports/inventory' },
      { name: 'HR Analytics', href: '/reports/hr' },
      { name: 'Custom Reports', href: '/reports/custom' },
    ],
  },
  {
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings',
    subitems: [
      { name: 'Organization', href: '/settings/organization' },
      { name: 'Users & Roles', href: '/settings/users' },
      { name: 'Modules & Subscriptions', href: '/settings/modules' },
      { name: 'Integration Settings', href: '/settings/integrations' },
    ],
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200 ease-out"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border
          z-40 transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64
          overflow-y-auto
        `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-sidebar-primary truncate">ProERP</h1>
                <p className="text-xs text-sidebar-accent truncate">Kenya</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden md:block p-1.5 hover:bg-sidebar-accent/10 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => {
                  if (item.subitems) {
                    toggleExpand(item.name);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
                  transition-all duration-200 ease-out text-sidebar-foreground
                  ${
                    expandedItems.includes(item.name)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/10'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.name}</span>
                    {item.subitems && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Subitems - only show when expanded and not collapsed */}
              {!isCollapsed && item.subitems && expandedItems.includes(item.name) && (
                <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-sidebar-accent/30 pl-2">
                  {item.subitems.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      onClick={() => setIsOpen(false)}
                      className="
                        block px-3 py-2 text-xs rounded-lg
                        text-sidebar-foreground hover:bg-sidebar-accent/15
                        transition-all duration-200 ease-out
                      "
                    >
                      {subitem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar/50">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            ProERP Kenya v1.0
          </p>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300`} />
    </>
  );
}
