import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, CheckCircle2 } from 'lucide-react';
import { getPurchaseOrders } from '@/app/actions';

export default async function GoodsReceiptPage() {
  const orders = await getPurchaseOrders();
  const received = orders.filter((o) => o.status === 'RECEIVED');
  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Goods Receipt</h1>
          <p className="text-muted-foreground">Stock received from suppliers — every receipt updates inventory automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Receipts</p>
            <h3 className="text-2xl font-bold text-foreground">{received.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Value Received</p>
            <h3 className="text-2xl font-bold text-primary">{fmt(received.reduce((s, o) => s + o.totalCostKES, 0))}</h3>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Received Purchase Orders</h2>
          </div>
          {received.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No goods received yet. Mark purchase orders as received in Procurement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Received Date</th>
                    <th className="py-3 px-6 font-semibold">Supplier</th>
                    <th className="py-3 px-6 font-semibold">Item</th>
                    <th className="py-3 px-6 font-semibold text-center">Qty</th>
                    <th className="py-3 px-6 font-semibold text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {received.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {o.receivedAt ? new Date(o.receivedAt).toLocaleDateString('en-KE') : '—'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{o.supplier.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{o.product?.name ?? o.rawMaterial?.name ?? 'General'}</td>
                      <td className="py-4 px-6 text-center text-foreground">{o.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">{fmt(o.totalCostKES)}</td>
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
