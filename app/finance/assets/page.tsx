import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, Plus, TrendingDown } from 'lucide-react';
import { getAssets } from '@/app/actions/accounting';
import { CreateAssetModal } from '@/components/accounting/create-asset-modal';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

const CATEGORY_COLORS: Record<string, string> = {
  EQUIPMENT:  'bg-blue-500/10 text-blue-600',
  VEHICLE:    'bg-orange-500/10 text-orange-600',
  FURNITURE:  'bg-amber-500/10 text-amber-600',
  BUILDING:   'bg-purple-500/10 text-purple-600',
  INTANGIBLE: 'bg-teal-500/10 text-teal-600',
};

export default async function AssetsPage() {
  const assets = await getAssets();

  const totalCost = assets.reduce((s, a) => s + a.acquisitionCost, 0);
  const totalDeprec = assets.reduce((s, a) => s + a.accumulatedDeprec, 0);
  const totalBookValue = assets.reduce((s, a) => s + a.bookValue, 0);
  const activeAssets = assets.filter((a) => a.status === 'ACTIVE').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Package className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Asset Register</h1>
            </div>
            <p className="text-muted-foreground ml-14">Fixed assets · Depreciation · Straight-line method</p>
          </div>
          <CreateAssetModal />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Active Assets', value: `${activeAssets}`, suffix: 'assets', color: 'text-blue-500' },
            { label: 'Total Cost', value: `KES ${fmt(totalCost)}`, color: 'text-foreground' },
            { label: 'Accumulated Depreciation', value: `KES ${fmt(totalDeprec)}`, color: 'text-red-500' },
            { label: 'Net Book Value', value: `KES ${fmt(totalBookValue)}`, color: 'text-emerald-500' },
          ].map((card) => (
            <div key={card.label} className="card-premium p-5">
              <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Asset Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Fixed Assets</h2>
            <span className="ml-auto text-sm text-muted-foreground">{assets.length} total</span>
          </div>

          {assets.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No assets registered</h3>
              <p className="text-muted-foreground mb-6">Add laptops, vehicles, furniture, and other fixed assets to track depreciation.</p>
              <CreateAssetModal />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    <th className="text-left px-5 py-3 font-semibold">Asset</th>
                    <th className="text-left px-5 py-3 font-semibold">Category</th>
                    <th className="text-right px-5 py-3 font-semibold">Acquired</th>
                    <th className="text-right px-5 py-3 font-semibold">Cost</th>
                    <th className="text-right px-5 py-3 font-semibold">Accum. Depr.</th>
                    <th className="text-right px-5 py-3 font-semibold">Book Value</th>
                    <th className="text-right px-5 py-3 font-semibold">Life (yrs)</th>
                    <th className="text-center px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => {
                    const monthlyDeprec = (asset.acquisitionCost - asset.residualValue) / (asset.usefulLifeYears * 12);
                    const depreciationPct = asset.acquisitionCost > 0
                      ? (asset.accumulatedDeprec / asset.acquisitionCost) * 100 : 0;
                    return (
                      <tr key={asset.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-foreground">{asset.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{asset.assetCode}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[asset.category] ?? 'bg-muted text-muted-foreground'}`}>
                            {asset.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-muted-foreground">
                          {new Date(asset.acquisitionDate).toLocaleDateString('en-KE')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono">{fmt(asset.acquisitionCost)}</td>
                        <td className="px-5 py-3.5 text-right font-mono text-red-500">
                          {fmt(asset.accumulatedDeprec)}
                          <div className="h-1 bg-muted rounded mt-1">
                            <div className="h-1 bg-red-400 rounded" style={{ width: `${Math.min(100, depreciationPct)}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">
                          {fmt(asset.bookValue)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-muted-foreground">
                          {asset.usefulLifeYears}y
                          <span className="block text-xs text-muted-foreground/60">KES {fmt(monthlyDeprec)}/mo</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            asset.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' :
                            asset.status === 'DISPOSED' ? 'bg-muted text-muted-foreground' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>{asset.status.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
