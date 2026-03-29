import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Receipt, CheckCircle } from 'lucide-react';
import { getSales } from '@/app/actions';

export default async function TaxCompliancePage() {
  const sales = await getSales();

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const paidSales = sales.filter((s) => s.status === 'PAID');
  const totalVAT = paidSales.reduce((sum, s) => sum + s.vatAmount, 0);
  const totalRevenue = paidSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const vatRate = 16;

  // Group by month
  const byMonth = paidSales.reduce<Record<string, { gross: number; vat: number; count: number }>>((acc, s) => {
    const key = new Date(s.saleDate).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = { gross: 0, vat: 0, count: 0 };
    acc[key].gross += s.totalAmount;
    acc[key].vat += s.vatAmount;
    acc[key].count += 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Tax Compliance</h1>
          <p className="text-muted-foreground">KRA VAT at 16% — monthly breakdown from all recorded sales transactions.</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Gross Revenue</p>
            <h3 className="text-2xl font-bold text-foreground">{fmt(totalRevenue)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total VAT Collected ({vatRate}%)</p>
            <h3 className="text-2xl font-bold text-primary">{fmt(totalVAT)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Net Revenue (Pre-Tax)</p>
            <h3 className="text-2xl font-bold text-foreground">{fmt(totalRevenue - totalVAT)}</h3>
          </div>
        </div>

        {/* Monthly VAT Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Receipt className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Monthly VAT Summary</h2>
          </div>
          {Object.keys(byMonth).length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No paid sales to report VAT on yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Period</th>
                    <th className="py-3 px-6 font-semibold text-center">Transactions</th>
                    <th className="py-3 px-6 font-semibold text-right">Gross Revenue</th>
                    <th className="py-3 px-6 font-semibold text-right">VAT (16%)</th>
                    <th className="py-3 px-6 font-semibold text-right">Net Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byMonth).map(([month, data]) => (
                    <tr key={month} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{month}</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">{data.count}</td>
                      <td className="py-4 px-6 text-right font-mono text-foreground">{fmt(data.gross)}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">{fmt(data.vat)}</td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">{fmt(data.gross - data.vat)}</td>
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
