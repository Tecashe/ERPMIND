import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  BookOpen, ArrowUpRight, ArrowDownRight, Scale, PieChart
} from 'lucide-react';
import { getTrialBalance, getProfitAndLoss, getJournalEntries } from '@/app/actions/accounting';
import { LedgerTabs } from '@/components/accounting/ledger-tabs';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

export default async function LedgerPage() {
  const [trial, pnl, journals] = await Promise.all([
    getTrialBalance(),
    getProfitAndLoss(),
    getJournalEntries(30),
  ]);

  const totalDebits = trial.reduce((s, a) => s + a.totalDebit, 0);
  const totalCredits = trial.reduce((s, a) => s + a.totalCredit, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">General Ledger</h1>
            <p className="text-muted-foreground">Chart of Accounts · Trial Balance · P&L · Balance Sheet</p>
          </div>
        </div>

        {/* P&L Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-emerald-500">KES {fmt(pnl.totalRevenue)}</p>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-500">KES {fmt(pnl.totalExpenses)}</p>
          </div>
          <div className={`card-premium p-6 ${pnl.netProfit >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${pnl.netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <Scale className={`w-5 h-5 ${pnl.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Net Profit / Loss</span>
            </div>
            <p className={`text-2xl font-bold ${pnl.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {pnl.netProfit < 0 ? '-' : ''}KES {fmt(Math.abs(pnl.netProfit))}
            </p>
          </div>
        </div>

        {/* Balance Check */}
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
          isBalanced ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
        }`}>
          <PieChart className={`w-5 h-5 shrink-0 ${isBalanced ? 'text-emerald-500' : 'text-red-500'}`} />
          <span className={`text-sm font-semibold ${isBalanced ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {isBalanced
              ? `✓ Books are balanced — Total Debits: KES ${fmt(totalDebits)} = Total Credits: KES ${fmt(totalCredits)}`
              : `⚠ Books out of balance — Debits: KES ${fmt(totalDebits)} vs Credits: KES ${fmt(totalCredits)}`
            }
          </span>
        </div>

        {/* Tabbed Content */}
        <LedgerTabs trial={trial} pnl={pnl} journals={journals} />

      </div>
    </DashboardLayout>
  );
}
