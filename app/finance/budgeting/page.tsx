import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { getChartOfAccounts, getBudgetVsActual, createBudget } from '@/app/actions/accounting';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });
const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM

export default async function BudgetingPage() {
  const [accounts, budgets] = await Promise.all([
    getChartOfAccounts(),
    getBudgetVsActual(currentPeriod),
  ]);

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
  const totalActual = budgets.reduce((s, b) => s + b.actual, 0);
  const overBudget = budgets.filter((b) => b.variancePct > 10);

  const periodLabel = new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Budgeting</h1>
            </div>
            <p className="text-muted-foreground ml-14">Budget vs Actuals · Variance Analysis — {periodLabel}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Budgeted</span>
            </div>
            <p className="text-2xl font-bold text-foreground">KES {fmt(totalBudgeted)}</p>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Actual</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">KES {fmt(totalActual)}</p>
          </div>
          <div className={`card-premium p-6 ${overBudget.length > 0 ? 'border-red-500/30' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className={`w-5 h-5 ${overBudget.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
              <span className="text-sm text-muted-foreground">Over Budget</span>
            </div>
            <p className={`text-2xl font-bold ${overBudget.length > 0 ? 'text-red-500' : 'text-foreground'}`}>
              {overBudget.length} accounts
            </p>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="card-premium py-20 text-center">
            <BarChart3 className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No budgets set for {periodLabel}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Set monthly budgets per account to track spending vs plan. Budgets are set per Chart of Accounts entry.
            </p>
            {accounts.length === 0 && (
              <p className="text-sm text-muted-foreground">First, ensure your Chart of Accounts is set up (run the CoA seed script).</p>
            )}
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b border-border flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Budget vs Actuals — {periodLabel}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    <th className="text-left px-5 py-3 font-semibold">Account</th>
                    <th className="text-right px-5 py-3 font-semibold">Budget</th>
                    <th className="text-right px-5 py-3 font-semibold">Actual</th>
                    <th className="text-right px-5 py-3 font-semibold">Variance</th>
                    <th className="text-right px-5 py-3 font-semibold">% Var</th>
                    <th className="text-left px-5 py-3 font-semibold w-40">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((b) => {
                    const pct = b.amount > 0 ? Math.min(100, (b.actual / b.amount) * 100) : 0;
                    const isOver = b.variancePct > 10;
                    return (
                      <tr key={b.id} className="border-t border-border hover:bg-muted/20">
                        <td className="px-5 py-3.5 font-medium text-foreground">{b.account.name}</td>
                        <td className="px-5 py-3.5 text-right font-mono">{fmt(b.amount)}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-semibold">{fmt(b.actual)}</td>
                        <td className={`px-5 py-3.5 text-right font-mono ${b.variance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {b.variance > 0 ? '+' : ''}{fmt(b.variance)}
                        </td>
                        <td className={`px-5 py-3.5 text-right font-semibold ${isOver ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {b.variancePct > 0 ? '+' : ''}{b.variancePct.toFixed(1)}%
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-2 bg-muted rounded-full overflow-hidden w-full">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
