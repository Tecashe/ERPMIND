// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   BarChart3,
//   TrendingUp,
//   ShoppingCart,
//   Package,
//   Users,
//   Hammer,
//   ShoppingBag,
//   FileText,
//   DollarSign,
//   Settings,
//   Menu,
//   X,
//   ChevronDown,
//   CreditCard,
// } from 'lucide-react';
// import { ThemeToggle } from './theme-toggle';

// interface NavItem {
//   name: string;
//   icon: React.ReactNode;
//   href: string;
//   subitems?: { name: string; href: string }[];
// }

// const NAV_ITEMS: NavItem[] = [
//   { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, href: '/dashboard' },
//   { name: 'Finance & Accounting', icon: <DollarSign className="w-5 h-5" />, href: '/finance' },
//   { name: 'Sales & Distribution', icon: <TrendingUp className="w-5 h-5" />, href: '/sales' },
//   { name: 'Inventory Management', icon: <Package className="w-5 h-5" />, href: '/inventory' },
//   { name: 'Human Resources', icon: <Users className="w-5 h-5" />, href: '/hr' },
//   { name: 'Procurement', icon: <ShoppingBag className="w-5 h-5" />, href: '/procurement' },
//   { name: 'Production', icon: <Hammer className="w-5 h-5" />, href: '/production' },
//   { name: 'CRM', icon: <ShoppingCart className="w-5 h-5" />, href: '/crm' },
//   { name: 'Fixed Assets', icon: <Package className="w-5 h-5" />, href: '/assets' },
//   { name: 'Reports & Analytics', icon: <FileText className="w-5 h-5" />, href: '/reports' },
//   { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/settings' },
// ];

// export function Sidebar({ 
//   isCollapsed, 
//   setIsCollapsed 
// }: { 
//   isCollapsed: boolean; 
//   setIsCollapsed: (v: boolean) => void 
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//   return (
//     <>
//       <button
//         onClick={toggleSidebar}
//         className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-muted rounded-xl bg-background/80 backdrop-blur-md shadow-sm border border-border transition-all duration-200"
//       >
//         {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       <aside
//         className={`
//           fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border
//           z-40 transition-all duration-300 ease-in-out flex flex-col
//           ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
//           ${isCollapsed && !isOpen ? 'md:w-20' : 'md:w-64'}
//         `}
//       >
//         {/* Header */}
//         <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/50">
//           <div className="flex items-center gap-3 overflow-hidden">
//             <div className={`
//               flex items-center justify-center flex-shrink-0 bg-primary/10 rounded-xl
//               ${isCollapsed && !isOpen ? 'w-10 h-10' : 'w-9 h-9'}
//               transition-all duration-300
//             `}>
//               <CreditCard className="w-5 h-5 text-primary" />
//             </div>
//             {(!isCollapsed || isOpen) && (
//               <div className="flex flex-col min-w-0 transition-opacity duration-300">
//                 <h1 className="text-sm font-bold text-foreground truncate">Nexus</h1>
//                 <p className="text-xs text-muted-foreground truncate tracking-wide">Kenya</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={toggleCollapse}
//             className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <Menu className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
//           {NAV_ITEMS.map((item) => {
//             const isActive = pathname.startsWith(item.href);

//             return (
//               <div key={item.name} className="relative group">
//                 <Link
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className={`
//                     flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium
//                     transition-all duration-200 overflow-hidden
//                     ${isActive 
//                       ? 'bg-primary text-primary-foreground shadow-sm' 
//                       : 'text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent'
//                     }
//                     ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start'}
//                   `}
//                 >
//                   <div className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : ''}`}>
//                     {item.icon}
//                   </div>

//                   {(!isCollapsed || isOpen) && (
//                     <span className="truncate flex-1 text-sm">{item.name}</span>
//                   )}
//                 </Link>

//                 {/* Highly Premium Tooltip for Collapsed State */}
//                 {isCollapsed && !isOpen && (
//                   <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 pointer-events-none px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-md shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
//                     {item.name}
//                     <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-foreground"></div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         {/* Footer actions */}
//         <div className="p-4 border-t border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md flex flex-col gap-2">
//           <ThemeToggle isCollapsed={isCollapsed && !isOpen} />

//           <div className={`
//             flex items-center gap-3 p-2 rounded-xl bg-muted/50 border border-border/50
//             ${isCollapsed && !isOpen ? 'justify-center' : 'justify-start'}
//           `}>
//             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0 shadow-sm">
//               SM
//             </div>
//             {(!isCollapsed || isOpen) && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-foreground truncate">Stephen Macharia</p>
//                 <p className="text-xs text-muted-foreground truncate">Admin</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
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
  Zap,
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  subitems?: { name: string; href: string }[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/dashboard',
    badge: 'NEW',
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
      { name: 'Point of Sale (POS)', href: '/pos' },
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
      { name: 'API Keys', href: '/settings/integrations/api-keys' },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isCollapsed, toggleCollapse, isOpen, setIsOpen }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border
          z-40 transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-24' : 'md:w-72'} w-72
          overflow-y-auto overflow-x-hidden
          flex flex-col
        `}
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(86, 180, 211, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)
          `,
        }}
      >
        {/* Logo Section with Gradient Underline */}
        <div className="relative border-b border-sidebar-border/50 px-4 py-5">
          {/* Gradient accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent, rgba(86, 180, 211, 0.5), transparent)',
            }}
          />

          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <Image src="/logo.png" alt="Nexus Logo" fill className="object-contain" priority />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-sidebar-foreground truncate">
                    Nexus
                  </h1>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    Premium Edition
                  </p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="w-full flex justify-center">
                <div className="relative w-9 h-9">
                  <Image src="/logo.png" alt="Nexus Logo" fill className="object-contain" priority />
                </div>
              </div>
            )}

            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-2 hover:bg-sidebar-accent/30 rounded-lg transition-all duration-200 group flex-shrink-0"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronDown
                className={`w-4 h-4 text-sidebar-foreground/60 group-hover:text-sidebar-primary transition-all ${isCollapsed ? 'rotate-90' : '-rotate-90'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isExpanded = expandedItems.includes(item.name);
            const isHovered = hoveredItem === item.name;

            return (
              <div key={item.name} className="relative">
                <button
                  onClick={() => {
                    if (item.subitems) {
                      toggleExpand(item.name);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium
                    transition-all duration-200 ease-out text-sidebar-foreground
                    relative group
                    ${isExpanded
                      ? 'bg-gradient-to-r from-sidebar-accent/40 to-sidebar-accent/20 text-sidebar-accent-foreground shadow-md shadow-sidebar-primary/10'
                      : isHovered
                        ? 'bg-sidebar-accent/25'
                        : 'hover:bg-sidebar-accent/15'
                    }
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  {/* Left accent line */}
                  {isExpanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-lg bg-gradient-to-b from-sidebar-primary to-sidebar-primary/50" />
                  )}

                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center relative z-10">
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.name}</span>

                      {item.badge && !isCollapsed && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sidebar-primary/80 text-white">
                          {item.badge}
                        </span>
                      )}

                      {item.subitems && (
                        <ChevronDown
                          className={`w-4 h-4 transition-all duration-300 text-sidebar-foreground/60 group-hover:text-sidebar-foreground ${isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Subitems - only show when expanded and not collapsed */}
                {!isCollapsed && item.subitems && isExpanded && (
                  <div className="mt-2 ml-3 space-y-1 border-l-2 border-sidebar-primary/30 pl-3 py-1">
                    {item.subitems.map((subitem, idx) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          block px-3 py-2 text-xs rounded-lg font-medium
                          text-sidebar-foreground/80 
                          transition-all duration-200 ease-out
                          relative group
                          hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/20
                          ${idx === 0 ? 'mt-2' : ''}
                        `}
                      >
                        <span className="relative z-10">{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border/50 px-4 py-4 mt-auto flex flex-col gap-3">
          <ThemeToggle isCollapsed={isCollapsed} />
          <div
            className="px-3 py-3 rounded-lg bg-sidebar-accent/15 border border-sidebar-accent/30"
            style={{
              backgroundImage: `
                linear-gradient(135deg, rgba(86, 180, 211, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)
              `,
            }}
          >
            {!isCollapsed && (
              <>
                <p className="text-xs font-semibold text-sidebar-foreground">
                  Nexus Premium
                </p>
                <p className="text-xs text-sidebar-foreground/60 mt-1">
                  v1.0 • Enterprise Edition
                </p>
              </>
            )}
            {isCollapsed && (
              <p className="text-xs text-center text-sidebar-foreground/60">v1.0</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
