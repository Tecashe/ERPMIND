import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign, TrendingDown, TrendingUp, Scale } from 'lucide-react';
import { getFinanceSummary } from '@/app/actions';
import { RecordFinancialModal } from '@/components/modals/record-financial-modal';

export default async function FinancePage() {
  const { totalIncome, totalExpenses, netBalance, records } = await getFinanceSummary();
  const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Finance</h1>
            <p className="text-muted-foreground text-lg">General ledger — income, expenses &amp; net balance.</p>
          </div>
          <div className="flex gap-3">
            <RecordFinancialModal defaultType="EXPENSE" />
            <RecordFinancialModal defaultType="INCOME" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-8">
            <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4"><TrendingUp className="w-6 h-6" /></div>
            <p className="text-muted-foreground font-medium mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-primary">KES {fmt(totalIncome)}</h3>
          </div>
          <div className="card-premium p-8">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl w-fit mb-4"><TrendingDown className="w-6 h-6" /></div>
            <p className="text-muted-foreground font-medium mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-destructive">KES {fmt(totalExpenses)}</h3>
          </div>
          <div className={`card-premium p-8 ${netBalance < 0 ? 'border-destructive/30' : ''}`}>
            <div className={`p-3 rounded-xl w-fit mb-4 ${netBalance >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <Scale className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Net Balance</p>
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {netBalance < 0 ? '-' : ''}KES {fmt(Math.abs(netBalance))}
            </h3>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">General Ledger</h2>
            {records.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No records yet</h3>
                <p className="text-muted-foreground">Record income or expenses, or make a sale to see entries here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Date</th>
                      <th className="pb-3 text-sm font-semibold">Description</th>
                      <th className="pb-3 text-sm font-semibold">Category</th>
                      <th className="pb-3 text-sm font-semibold text-center">Type</th>
                      <th className="pb-3 text-sm font-semibold text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(r.date).toLocaleDateString('en-KE')}
                        </td>
                        <td className="py-4 font-semibold text-foreground">{r.description}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            {r.category}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            r.type === 'INCOME' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {r.type}
                          </span>
                        </td>
                        <td className={`py-4 font-mono font-bold text-right ${
                          r.type === 'INCOME' ? 'text-primary' : 'text-destructive'
                        }`}>
                          {r.type === 'INCOME' ? '+' : '-'} {fmt(r.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
