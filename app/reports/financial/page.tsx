import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BarChart3, TrendingUp, TrendingDown, Scale, FileText } from 'lucide-react';
import { getFinanceSummary, getSales, getFinancialRecords } from '@/app/actions';

export default async function FinancialReportsPage() {
  const [summary, sales, records] = await Promise.all([
    getFinanceSummary(),
    getSales(),
    getFinancialRecords(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  const totalSalesRevenue = sales.reduce((s: number, r: { totalAmount: number }) => s + r.totalAmount, 0);
  const totalVAT = sales.reduce((s: number, r: { vatAmount: number }) => s + r.vatAmount, 0);
  const grossProfit = summary.totalIncome - summary.totalExpenses;

  // Monthly revenue trend
  const monthlyRevenue = sales.reduce<Record<string, number>>((acc: Record<string, number>, s: { saleDate: Date | string; totalAmount: number }) => {
    const key = new Date(s.saleDate).toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
    acc[key] = (acc[key] ?? 0) + s.totalAmount;
    return acc;
  }, {});

  const maxMonthly = Math.max(...(Object.values(monthlyRevenue) as number[]), 1);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Financial Reports</h1>
          <p className="text-muted-foreground">Consolidated financial performance — live data from Sales, Procurement, HR, and Finance modules.</p>
        </div>

        {/* P&L Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
            </div>
            <h3 className="text-xl font-bold text-primary">{fmt(summary.totalIncome)}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
            </div>
            <h3 className="text-xl font-bold text-destructive">{fmt(summary.totalExpenses)}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-foreground" />
              <p className="text-sm text-muted-foreground font-medium">Gross Profit</p>
            </div>
            <h3 className={`text-xl font-bold ${grossProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {grossProfit < 0 ? '-' : ''}{fmt(Math.abs(grossProfit))}
            </h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-foreground" />
              <p className="text-sm text-muted-foreground font-medium">VAT Collected</p>
            </div>
            <h3 className="text-xl font-bold text-foreground">{fmt(totalVAT)}</h3>
          </div>
        </div>

        {/* Revenue Bar Chart (CSS) */}
        {Object.keys(monthlyRevenue).length > 0 && (
          <div className="card-premium p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Monthly Revenue Trend</h2>
            </div>
            <div className="flex items-end gap-3 h-36">
              {Object.entries(monthlyRevenue).map(([month, amount]) => {
                const amtNum = amount as number;
                const height = (amtNum / maxMonthly) * 100;
                return (
                  <div key={month} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs text-muted-foreground font-mono">{fmt(amtNum).replace('KES ', '')}</span>
                    <div className="w-full bg-primary/20 rounded-t-sm overflow-hidden" style={{ height: 80 }}>
                      <div
                        className="w-full bg-primary rounded-t-sm mt-auto transition-all"
                        style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Breakdown Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Income Statement</h2></div>
          <div className="divide-y divide-border">
            <div className="flex justify-between p-5 hover:bg-muted/20">
              <span className="text-muted-foreground">Sales Revenue</span>
              <span className="font-mono font-bold text-primary">{fmt(totalSalesRevenue)}</span>
            </div>
            <div className="flex justify-between p-5 hover:bg-muted/20">
              <span className="text-muted-foreground pl-4">Less: VAT (16%)</span>
              <span className="font-mono text-muted-foreground">({fmt(totalVAT)})</span>
            </div>
            <div className="flex justify-between p-5 hover:bg-muted/20 font-semibold">
              <span>Net Revenue</span>
              <span className="font-mono">{fmt(totalSalesRevenue - totalVAT)}</span>
            </div>
            <div className="flex justify-between p-5 hover:bg-muted/20">
              <span className="text-muted-foreground">Operating Expenses</span>
              <span className="font-mono text-destructive">({fmt(summary.totalExpenses)})</span>
            </div>
            <div className={`flex justify-between p-5 font-bold text-lg ${grossProfit >= 0 ? 'bg-primary/5' : 'bg-destructive/5'}`}>
              <span className={grossProfit >= 0 ? 'text-primary' : 'text-destructive'}>Net Profit / Loss</span>
              <span className={`font-mono ${grossProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {grossProfit < 0 ? '−' : '+'} {fmt(Math.abs(grossProfit))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
