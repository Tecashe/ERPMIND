import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ShoppingCart, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { getSales, getProducts, getCustomers } from '@/app/actions';
import { RecordSaleModal } from '@/components/modals/record-sale-modal';

export default async function SalesOrdersPage() {
  const [sales, products, customers] = await Promise.all([
    getSales(),
    getProducts(),
    getCustomers(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0);
  const pendingCount = sales.filter((s) => s.status === 'PENDING').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Sales Orders</h1>
            <p className="text-muted-foreground">All sales transactions — linked to inventory and finance in real-time.</p>
          </div>
          <RecordSaleModal products={products} customers={customers} />
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><ShoppingCart className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-foreground">{sales.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
              <h3 className="text-xl font-bold text-primary">{fmt(totalRevenue)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${pendingCount > 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pending Orders</p>
              <h3 className={`text-2xl font-bold ${pendingCount > 0 ? 'text-destructive' : 'text-foreground'}`}>{pendingCount}</h3>
            </div>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Order Ledger</h2>
          </div>
          {sales.length === 0 ? (
            <div className="py-16 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Record your first sale to populate this ledger.</p>
              <RecordSaleModal products={products} customers={customers} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-6 font-semibold text-center">Qty</th>
                    <th className="py-3 px-6 font-semibold text-right">VAT (KES)</th>
                    <th className="py-3 px-6 font-semibold text-right">Total (KES)</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{s.product.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.customer?.name ?? 'Walk-in'}</td>
                      <td className="py-4 px-6 text-center text-foreground">{s.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">
                        {s.vatAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">
                        {s.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          s.status === 'PAID' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {s.status}
                        </span>
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
