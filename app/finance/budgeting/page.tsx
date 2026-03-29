import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PieChart, Construction } from 'lucide-react';
import { getFinanceSummary } from '@/app/actions';

export default async function BudgetingPage() {
  const summary = await getFinanceSummary();
  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const categories = [
    { label: 'Payroll', budget: 500000, actual: summary.records.filter(r => r.category === 'PAYROLL').reduce((s, r) => s + r.amount, 0) },
    { label: 'Procurement', budget: 800000, actual: summary.records.filter(r => r.category === 'PROCUREMENT').reduce((s, r) => s + r.amount, 0) },
    { label: 'General', budget: 200000, actual: summary.records.filter(r => r.category === 'GENERAL' && r.type === 'EXPENSE').reduce((s, r) => s + r.amount, 0) },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Budgeting</h1>
          <p className="text-muted-foreground">Track planned vs. actual expenditure across major cost categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Budgeted</p>
            <h3 className="text-2xl font-bold text-foreground">{fmt(categories.reduce((s, c) => s + c.budget, 0))}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Spent</p>
            <h3 className="text-2xl font-bold text-destructive">{fmt(summary.totalExpenses)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Budget Variance</p>
            {(() => {
              const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
              const variance = totalBudget - summary.totalExpenses;
              return (
                <h3 className={`text-2xl font-bold ${variance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {variance < 0 ? '-' : '+'}{fmt(Math.abs(variance))}
                </h3>
              );
            })()}
          </div>
        </div>

        {/* Budget vs Actual breakdown */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Budget vs. Actual</h2>
          </div>
          <div className="space-y-6">
            {categories.map((cat) => {
              const pct = cat.budget > 0 ? Math.min((cat.actual / cat.budget) * 100, 100) : 0;
              const overBudget = cat.actual > cat.budget;
              return (
                <div key={cat.label}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-semibold text-foreground">{cat.label}</span>
                    <div className="text-right text-sm">
                      <span className={overBudget ? 'text-destructive font-bold' : 'text-primary font-bold'}>
                        {fmt(cat.actual)}
                      </span>
                      <span className="text-muted-foreground"> / {fmt(cat.budget)}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${overBudget ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% of budget used</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 card-premium p-6 border border-dashed border-border flex items-center gap-4">
          <Construction className="w-8 h-8 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Advanced budgeting</span> — custom budget targets per department, period planning, and forecasting will be available in the next schema update.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
