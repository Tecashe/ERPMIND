import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingDown, Package } from 'lucide-react';
import { getSales } from '@/app/actions';

export default async function GoodsIssuePage() {
  const sales = await getSales();
  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  const totalQty = sales.reduce((s, r) => s + r.quantity, 0);
  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Goods Issue</h1>
          <p className="text-muted-foreground">Stock dispatched to customers — each sale deducts inventory automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Issues</p>
            <h3 className="text-2xl font-bold text-foreground">{sales.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Units Dispatched</p>
            <h3 className="text-2xl font-bold text-destructive">{totalQty}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Revenue Generated</p>
            <h3 className="text-2xl font-bold text-primary">{fmt(totalRevenue)}</h3>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">Stock Issues Log</h2>
          </div>
          {sales.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No stock issued yet. Sales automatically register here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-6 font-semibold text-center">Units Issued</th>
                    <th className="py-3 px-6 font-semibold text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{s.product.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.customer?.name ?? 'Walk-in'}</td>
                      <td className="py-4 px-6 text-center font-bold text-destructive">{s.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono text-foreground">
                        {s.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
