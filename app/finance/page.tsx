import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  TrendingUp, TrendingDown, Wallet, AlertCircle, FileCheck,
  Receipt, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, RefreshCw
} from 'lucide-react';
import { getAccountingDashboard } from '@/app/actions/accounting';
import { getFinanceSummary } from '@/app/actions';
import Link from 'next/link';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default async function FinancePage() {
  const [dashboard, legacy] = await Promise.all([
    getAccountingDashboard(),
    getFinanceSummary(),
  ]);

  const kpiCards = [
    {
      label: 'Monthly Revenue',
      value: `KES ${fmt(dashboard.monthRevenue)}`,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      trend: '+vs last month',
    },
    {
      label: 'Monthly Expenses',
      value: `KES ${fmt(dashboard.monthExpenses)}`,
      icon: TrendingDown,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Net Cashflow (Month)',
      value: `KES ${fmt(dashboard.netCashflow)}`,
      icon: dashboard.netCashflow >= 0 ? ArrowUpRight : ArrowDownRight,
      color: dashboard.netCashflow >= 0 ? 'text-emerald-500' : 'text-red-500',
      bg: dashboard.netCashflow >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Total Bank Balance',
      value: `KES ${fmt(dashboard.totalBankBalance)}`,
      icon: Wallet,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Accounts Receivable',
      value: `KES ${fmt(dashboard.totalAR)}`,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      alert: dashboard.overdueInvoices > 0 ? `${dashboard.overdueInvoices} overdue` : undefined,
    },
    {
      label: 'Accounts Payable',
      value: `KES ${fmt(dashboard.totalAP)}`,
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      alert: dashboard.overdueBills > 0 ? `${dashboard.overdueBills} overdue` : undefined,
    },
  ];

  const quickLinks = [
    { href: '/finance/invoices', label: 'Invoices', icon: Receipt, desc: 'Create & send invoices', badge: dashboard.pendingETIMS > 0 ? `${dashboard.pendingETIMS} eTIMS pending` : undefined },
    { href: '/finance/tax', label: 'Tax & eTIMS', icon: FileCheck, desc: 'VAT, PAYE, KRA compliance' },
    { href: '/finance/ledger', label: 'General Ledger', icon: CheckCircle2, desc: 'CoA, Trial Balance, P&L' },
    { href: '/finance/banking', label: 'Banking', icon: Wallet, desc: 'Reconciliation & accounts' },
    { href: '/finance/payroll', label: 'Payroll', icon: TrendingUp, desc: 'Kenya statutory payroll' },
    { href: '/finance/budgeting', label: 'Budgets', icon: RefreshCw, desc: 'Budget vs Actuals' },
    { href: '/finance/assets', label: 'Assets', icon: ArrowUpRight, desc: 'Fixed asset register' },
    { href: '/finance/payable', label: 'Bills / AP', icon: TrendingDown, desc: 'Supplier bills & payments' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Accounting</h1>
              <p className="text-muted-foreground">Kenya-compliant finance · eTIMS · Double-entry bookkeeping</p>
            </div>
          </div>
        </div>

        {/* Compliance Alerts */}
        {(dashboard.pendingETIMS > 0 || dashboard.overdueInvoices > 0 || dashboard.overdueBills > 0) && (
          <div className="mb-8 space-y-2">
            {dashboard.pendingETIMS > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  {dashboard.pendingETIMS} invoice{dashboard.pendingETIMS > 1 ? 's' : ''} pending eTIMS submission to KRA.
                </span>
                <Link href="/finance/invoices" className="ml-auto text-xs underline font-semibold">Submit Now →</Link>
              </div>
            )}
            {dashboard.overdueInvoices > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400">
                <Clock className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{dashboard.overdueInvoices} invoice(s) are overdue. Follow up with customers.</span>
                <Link href="/finance/invoices" className="ml-auto text-xs underline font-semibold">View →</Link>
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {kpiCards.map((card) => (
            <div key={card.label} className="card-premium p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.alert && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-500">
                    {card.alert}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Accounting Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-premium p-5 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer block"
              >
                <div className="flex items-center gap-3 mb-2">
                  <link.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-foreground text-sm">{link.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
                {link.badge && (
                  <span className="mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Bank Accounts */}
        {dashboard.bankAccounts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Bank Balances</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.bankAccounts.map((acc) => (
                <div key={acc.name} className="card-premium p-5">
                  <p className="text-sm text-muted-foreground font-medium mb-1">{acc.name}</p>
                  <p className="text-2xl font-bold text-foreground">{acc.currency} {fmt(acc.currentBalance)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Journal Entries */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Recent Journal Entries</h2>
            <Link href="/finance/ledger" className="text-sm text-primary hover:underline font-medium">View All →</Link>
          </div>
          {dashboard.recentJournals.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No journal entries yet. Create an invoice or record a transaction to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {dashboard.recentJournals.map((entry) => (
                <div key={entry.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">{entry.reference} · {new Date(entry.entryDate).toLocaleDateString('en-KE')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    entry.status === 'POSTED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                  }`}>{entry.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
