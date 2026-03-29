import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Settings, Shield, CreditCard, Building } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Organization Profile', icon: <Building className="w-5 h-5" />, desc: 'Manage KRA PIN, VAT numbers, and local business registration.' },
    { title: 'Security & Access', icon: <Shield className="w-5 h-5" />, desc: 'Configure permissions and 2-factor authentication.' },
    { title: 'Billing & Plan', icon: <CreditCard className="w-5 h-5" />, desc: 'View M-Pesa statements and upgrade module subscriptions.' },
    { title: 'General Preferences', icon: <Settings className="w-5 h-5" />, desc: 'Set default currency (KES), timezones, and system alerts.' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">Configure your ERP preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec, i) => (
            <div key={i} className="card-premium p-6 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {sec.icon}
                </div>
                <h3 className="font-bold text-xl text-foreground">{sec.title}</h3>
              </div>
              <p className="text-muted-foreground">{sec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
