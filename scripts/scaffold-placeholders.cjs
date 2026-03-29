const fs = require('fs');
const path = require('path');

const makeTemplate = (title, module) => [
  'import React from "react";',
  'import { DashboardLayout } from "@/components/dashboard-layout";',
  'import { Construction } from "lucide-react";',
  '',
  'export default function Page() {',
  '  return (',
  '    <DashboardLayout>',
  '      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">',
  '        <div className="mb-8">',
  '          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">' + title + '</h1>',
  '          <p className="text-muted-foreground">' + module + ' Module Workspace</p>',
  '        </div>',
  '        <div className="card-premium p-12 text-center border border-dashed border-border">',
  '          <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-4" />',
  '          <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>',
  '          <p className="text-muted-foreground max-w-md mx-auto">' + title + ' features are being built out in the next schema expansion.</p>',
  '        </div>',
  '      </div>',
  '    </DashboardLayout>',
  '  );',
  '}',
].join('\n');

const pages = [
  ['app/sales/quotations', 'Quotations', 'Sales'],
  ['app/sales/deliveries', 'Deliveries', 'Sales'],
  ['app/inventory/warehouses', 'Warehouses', 'Inventory'],
  ['app/inventory/transfers', 'Stock Transfers', 'Inventory'],
  ['app/hr/attendance', 'Attendance', 'Human Resources'],
  ['app/hr/leave', 'Leave Management', 'Human Resources'],
  ['app/hr/benefits', 'Benefits', 'Human Resources'],
  ['app/procurement/requests', 'Purchase Requests', 'Procurement'],
  ['app/procurement/invoices', 'Vendor Invoices', 'Procurement'],
  ['app/production/centers', 'Work Centers', 'Production'],
  ['app/production/scheduling', 'Production Scheduling', 'Production'],
  ['app/crm/leads', 'Leads', 'CRM'],
  ['app/crm/opportunities', 'Opportunities', 'CRM'],
  ['app/crm/campaigns', 'Campaigns', 'CRM'],
  ['app/assets/register', 'Asset Register', 'Fixed Assets'],
  ['app/assets/depreciation', 'Depreciation', 'Fixed Assets'],
  ['app/assets/maintenance', 'Asset Maintenance', 'Fixed Assets'],
  ['app/reports/custom', 'Custom Reports', 'Reports'],
  ['app/settings/organization', 'Organization Settings', 'Settings'],
  ['app/settings/users', 'Users & Roles', 'Settings'],
  ['app/settings/modules', 'Modules & Subscriptions', 'Settings'],
  ['app/settings/integrations', 'Integration Settings', 'Settings'],
];

const base = 'C:/Users/Stephen Macharia/Downloads/ERP';
for (const [route, title, module] of pages) {
  const dir = path.join(base, route);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'page.tsx');
  fs.writeFileSync(file, makeTemplate(title, module), 'utf8');
  console.log('Created: ' + file);
}
console.log('Done!');
