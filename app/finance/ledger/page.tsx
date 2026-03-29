import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { FileText, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { getFinancialRecords, getFinanceSummary } from '@/app/actions';

export default async function GeneralLedgerPage() {
  const [summary, records] = await Promise.all([
    getFinanceSummary(),
    getFinancialRecords(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">General Ledger</h1>
          <p className="text-muted-foreground">Complete double-entry ledger — every financial event recorded and categorised.</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Income</p>
              <h3 className="text-xl font-bold text-primary">{fmt(summary.totalIncome)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><TrendingDown className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
              <h3 className="text-xl font-bold text-destructive">{fmt(summary.totalExpenses)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${summary.netBalance >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Net Balance</p>
              <h3 className={`text-xl font-bold ${summary.netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {summary.netBalance < 0 ? '-' : ''}{fmt(Math.abs(summary.netBalance))}
              </h3>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">All Transactions</h2>
            <span className="text-sm text-muted-foreground">{records.length} entries</span>
          </div>
          {records.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">Record sales, process payroll, or receive purchase orders to see entries here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Description</th>
                    <th className="py-3 px-6 font-semibold">Category</th>
                    <th className="py-3 px-6 font-semibold">Type</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 font-medium text-foreground">{r.description}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-medium">
                          {r.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          r.type === 'INCOME' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold ${
                        r.type === 'INCOME' ? 'text-primary' : 'text-destructive'
                      }`}>
                        {r.type === 'INCOME' ? '+' : '−'} {r.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
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
