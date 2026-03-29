import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Scale, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { getFinanceSummary, getFinancialRecords } from '@/app/actions';

export default async function BankReconciliationPage() {
  const [summary, records] = await Promise.all([
    getFinanceSummary(),
    getFinancialRecords(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  // Group by category
  const byCategory = records.reduce<Record<string, { in: number; out: number }>>((acc, r) => {
    const cat = r.category ?? 'GENERAL';
    if (!acc[cat]) acc[cat] = { in: 0, out: 0 };
    if (r.type === 'INCOME') acc[cat].in += r.amount;
    else acc[cat].out += r.amount;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Bank Reconciliation</h1>
          <p className="text-muted-foreground">Compare financial records against your bank statement — reconcile debits and credits.</p>
        </div>

        {/* Summary Reconciliation View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Credits</p>
              <h3 className="text-xl font-bold text-primary">{fmt(summary.totalIncome)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Debits</p>
              <h3 className="text-xl font-bold text-destructive">{fmt(summary.totalExpenses)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${summary.netBalance >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Closing Balance</p>
              <h3 className={`text-xl font-bold ${summary.netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {summary.netBalance < 0 ? '-' : ''}{fmt(Math.abs(summary.netBalance))}
              </h3>
            </div>
          </div>
        </div>

        {/* By Category */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Reconciliation by Category</h2>
          </div>
          {Object.keys(byCategory).length === 0 ? (
            <div className="py-12 text-center">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions to reconcile yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Category</th>
                    <th className="py-3 px-6 font-semibold text-right">Credits (KES)</th>
                    <th className="py-3 px-6 font-semibold text-right">Debits (KES)</th>
                    <th className="py-3 px-6 font-semibold text-right">Net (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byCategory).map(([cat, vals]) => {
                    const net = vals.in - vals.out;
                    return (
                      <tr key={cat} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-medium">{cat}</span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-primary">{vals.in.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                        <td className="py-4 px-6 text-right font-mono text-destructive">{vals.out.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                        <td className={`py-4 px-6 text-right font-mono font-bold ${net >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {net < 0 ? '-' : '+'} {Math.abs(net).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t-2 border-border">
                    <td className="py-3 px-6 font-bold text-foreground">TOTAL</td>
                    <td className="py-3 px-6 text-right font-mono font-bold text-primary">{fmt(summary.totalIncome)}</td>
                    <td className="py-3 px-6 text-right font-mono font-bold text-destructive">{fmt(summary.totalExpenses)}</td>
                    <td className={`py-3 px-6 text-right font-mono font-bold ${summary.netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {summary.netBalance < 0 ? '-' : '+'} {fmt(Math.abs(summary.netBalance))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
