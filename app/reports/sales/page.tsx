import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { getSales, getCustomers, getProducts } from '@/app/actions';

export default async function SalesReportPage() {
  const [sales, customers, products] = await Promise.all([
    getSales(),
    getCustomers(),
    getProducts(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0);
  const paidCount = sales.filter((s) => s.status === 'PAID').length;

  // Top products
  const revenueByProduct = sales.reduce<Record<string, { name: string; qty: number; revenue: number }>>((acc, s) => {
    if (!acc[s.productId]) acc[s.productId] = { name: s.product.name, qty: 0, revenue: 0 };
    acc[s.productId].qty += s.quantity;
    acc[s.productId].revenue += s.totalAmount;
    return acc;
  }, {});

  const topProducts = Object.values(revenueByProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Top customers
  const revenueByCustomer = sales.filter(s => s.customer).reduce<Record<string, { name: string; orders: number; revenue: number }>>((acc, s) => {
    const key = s.customer!.id;
    if (!acc[key]) acc[key] = { name: s.customer!.name, orders: 0, revenue: 0 };
    acc[key].orders += 1;
    acc[key].revenue += s.totalAmount;
    return acc;
  }, {});

  const topCustomers = Object.values(revenueByCustomer).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Sales Reports</h1>
          <p className="text-muted-foreground">Sales analytics — top products, top customers, and revenue breakdown across all transactions.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Total Revenue</p></div>
            <h3 className="text-xl font-bold text-primary">{fmt(totalRevenue)}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-foreground" /><p className="text-sm text-muted-foreground">Total Orders</p></div>
            <h3 className="text-xl font-bold text-foreground">{sales.length}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-foreground" /><p className="text-sm text-muted-foreground">Customers</p></div>
            <h3 className="text-xl font-bold text-foreground">{customers.length}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><Package className="w-4 h-4 text-foreground" /><p className="text-sm text-muted-foreground">Paid Orders</p></div>
            <h3 className="text-xl font-bold text-primary">{paidCount}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="card-premium overflow-hidden">
            <div className="p-6 border-b border-border"><h2 className="text-lg font-bold text-foreground">Top 5 Products by Revenue</h2></div>
            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No sales data</div>
            ) : (
              <div className="divide-y divide-border">
                {topProducts.map((p, i) => {
                  const pct = (p.revenue / totalRevenue) * 100;
                  return (
                    <div key={i} className="p-5">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-semibold text-foreground truncate pr-4">{p.name}</span>
                        <span className="font-mono text-primary text-sm flex-shrink-0">{fmt(p.revenue)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{p.qty} units sold · {pct.toFixed(1)}% of revenue</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Customers */}
          <div className="card-premium overflow-hidden">
            <div className="p-6 border-b border-border"><h2 className="text-lg font-bold text-foreground">Top 5 Customers by Revenue</h2></div>
            {topCustomers.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No customer sales data</div>
            ) : (
              <div className="divide-y divide-border">
                {topCustomers.map((c, i) => {
                  const pct = totalRevenue > 0 ? (c.revenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={i} className="p-5">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-semibold text-foreground truncate pr-4">{c.name}</span>
                        <span className="font-mono text-primary text-sm flex-shrink-0">{fmt(c.revenue)}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.orders} orders · {pct.toFixed(1)}% of revenue</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
