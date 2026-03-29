import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { getSales } from '@/app/actions';

export default async function AccountsReceivablePage() {
  const sales = await getSales();

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const pending = sales.filter((s) => s.status === 'PENDING');
  const paid = sales.filter((s) => s.status === 'PAID');

  const totalReceivable = pending.reduce((s, r) => s + r.totalAmount, 0);
  const totalCollected = paid.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Accounts Receivable</h1>
          <p className="text-muted-foreground">Track money owed to you — outstanding and collected customer payments.</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Outstanding Receivables</p>
              <h3 className="text-xl font-bold text-destructive">{fmt(totalReceivable)}</h3>
              <p className="text-xs text-muted-foreground">{pending.length} pending payments</p>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Collected</p>
              <h3 className="text-xl font-bold text-primary">{fmt(totalCollected)}</h3>
              <p className="text-xs text-muted-foreground">{paid.length} paid invoices</p>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-muted text-muted-foreground rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Transactions</p>
              <h3 className="text-xl font-bold text-foreground">{sales.length}</h3>
            </div>
          </div>
        </div>

        {/* Pending Receivables */}
        {pending.length > 0 && (
          <div className="card-premium overflow-hidden mb-6">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Clock className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-bold text-foreground">Pending Payments</h2>
              <span className="ml-auto text-xs bg-destructive/10 text-destructive px-2.5 py-1 rounded-full font-medium">
                {fmt(totalReceivable)} owed
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-6 font-semibold text-center">Qty</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount Due</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{s.product.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.customer?.name ?? 'Walk-in'}</td>
                      <td className="py-4 px-6 text-center text-foreground">{s.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-destructive">
                        {fmt(s.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Collected */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Collected Payments</h2>
          </div>
          {paid.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No payments collected yet. Record a sale to see data here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-6 font-semibold text-right">VAT</th>
                    <th className="py-3 px-6 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {paid.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{s.product.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.customer?.name ?? 'Walk-in'}</td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">
                        {fmt(s.vatAmount)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">
                        {fmt(s.totalAmount)}
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
