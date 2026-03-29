import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, PlusCircle } from 'lucide-react';

export default function AssetsPage() {
  const assets = [
    { name: 'Delivery Van', id: 'KCD 123X', value: 'KES 2,500,000', status: 'Active' },
    { name: 'MacBook Pro 16"', id: 'AS-045', value: 'KES 350,000', status: 'Deployed' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">
              Fixed Assets
            </h1>
            <p className="text-muted-foreground text-lg">Track company property and depreciation.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>
        <div className="card-premium overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Asset Register</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border/50 text-muted-foreground">
                    <th className="pb-3 text-sm font-semibold">Asset Name</th>
                    <th className="pb-3 text-sm font-semibold">Identifier</th>
                    <th className="pb-3 text-sm font-semibold text-right">Value</th>
                    <th className="pb-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-semibold text-foreground flex items-center gap-3">
                        <Package className="w-4 h-4 text-primary" />
                        {asset.name}
                      </td>
                      <td className="py-4 text-muted-foreground font-mono">{asset.id}</td>
                      <td className="py-4 font-mono font-bold text-right text-foreground">{asset.value}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
