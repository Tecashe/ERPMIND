import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPurchaseOrders } from '@/app/actions';

export default async function AccountsPayablePage() {
  const orders = await getPurchaseOrders();

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const pending = orders.filter((o) => o.status === 'PENDING');
  const received = orders.filter((o) => o.status === 'RECEIVED');
  const cancelled = orders.filter((o) => o.status === 'CANCELLED');

  const totalOutstanding = pending.reduce((s, o) => s + o.totalCostKES, 0);
  const totalPaid = received.reduce((s, o) => s + o.totalCostKES, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Accounts Payable</h1>
          <p className="text-muted-foreground">Track money owed to suppliers — pending and completed purchase orders.</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Outstanding Payables</p>
              <h3 className="text-xl font-bold text-destructive">{fmt(totalOutstanding)}</h3>
              <p className="text-xs text-muted-foreground">{pending.length} pending orders</p>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Paid</p>
              <h3 className="text-xl font-bold text-primary">{fmt(totalPaid)}</h3>
              <p className="text-xs text-muted-foreground">{received.length} received orders</p>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-muted text-muted-foreground rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total POs</p>
              <h3 className="text-xl font-bold text-foreground">{orders.length}</h3>
              <p className="text-xs text-muted-foreground">{cancelled.length} cancelled</p>
            </div>
          </div>
        </div>

        {/* Pending Payables */}
        <div className="card-premium overflow-hidden mb-6">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Clock className="w-5 h-5 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">Pending Payables</h2>
          </div>
          {pending.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <p className="text-muted-foreground">All purchase orders settled. No outstanding payables.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Supplier</th>
                    <th className="py-3 px-6 font-semibold">Item</th>
                    <th className="py-3 px-6 font-semibold text-center">Qty</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{o.supplier.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {o.product?.name ?? o.rawMaterial?.name ?? 'General Order'}
                      </td>
                      <td className="py-4 px-6 text-center text-foreground">{o.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-destructive">
                        {fmt(o.totalCostKES)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Settled Payables */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Settled Payables</h2>
          </div>
          {received.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No settled purchase orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Received</th>
                    <th className="py-3 px-6 font-semibold">Supplier</th>
                    <th className="py-3 px-6 font-semibold">Item</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {received.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {o.receivedAt ? new Date(o.receivedAt).toLocaleDateString('en-KE') : '—'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{o.supplier.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {o.product?.name ?? o.rawMaterial?.name ?? 'General Order'}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-foreground">
                        {fmt(o.totalCostKES)}
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
