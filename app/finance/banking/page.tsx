import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Wallet, Plus, RefreshCw } from 'lucide-react';
import { getBankAccounts } from '@/app/actions/accounting';
import { CreateBankAccountModal } from '@/components/accounting/create-bank-account-modal';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

const BANK_COLORS: Record<string, string> = {
  KCB: 'bg-green-600', Equity: 'bg-red-600', 'M-Pesa': 'bg-emerald-500',
  NCBA: 'bg-blue-700', Absa: 'bg-red-700', 'Co-op': 'bg-blue-600',
  Stanbic: 'bg-blue-900', 'Standard Chartered': 'bg-blue-800',
};

export default async function BankingPage() {
  const accounts = await getBankAccounts();
  const totalBalance = accounts.reduce((s, a) => s + a.currentBalance, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Wallet className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Banking</h1>
            </div>
            <p className="text-muted-foreground ml-14">Bank accounts · Reconciliation · M-Pesa · Multi-currency</p>
          </div>
          <CreateBankAccountModal />
        </div>

        {/* Total Balance */}
        <div className="mb-8 card-premium p-6 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Total Cash Position</p>
              <p className="text-4xl font-bold text-primary">KES {fmt(totalBalance)}</p>
              <p className="text-sm text-muted-foreground mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
            </div>
            <Wallet className="w-16 h-16 text-primary/10" />
          </div>
        </div>

        {/* Bank Cards */}
        {accounts.length === 0 ? (
          <div className="card-premium py-20 text-center">
            <Wallet className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No bank accounts yet</h3>
            <p className="text-muted-foreground mb-6">Add your KCB, Equity, M-Pesa or any other account to start tracking cash.</p>
            <CreateBankAccountModal />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {accounts.map((acc) => {
              const colorClass = BANK_COLORS[acc.bankName] ?? 'bg-primary';
              return (
                <div key={acc.id} className="card-premium overflow-hidden">
                  <div className={`${colorClass} p-5 text-white`}>
                    <div className="flex items-center justify-between mb-6">
                      <p className="font-semibold">{acc.bankName}</p>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{acc.accountType}</span>
                    </div>
                    <p className="font-mono text-sm opacity-80">{acc.accountNumber}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{acc.name}</p>
                    <p className="text-2xl font-bold text-foreground">{acc.currency} {fmt(acc.currentBalance)}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{(acc as unknown as { _count: { transactions: number } })._count.transactions} transactions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reconciliation Info */}
        <div className="card-premium p-6 border border-border">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" /> Bank Reconciliation
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Import bank statements (CSV) to match transactions against your journal entries. 
            Supports KCB, Equity Bank, M-Pesa paybill exports, and standard OFX/CSV formats.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'M-Pesa Statement', desc: 'Download from M-Pesa portal → Business → Statements' },
              { label: 'KCB/Equity CSV', desc: 'Download from internet banking → Transactions → Export CSV' },
              { label: 'Manual Entry', desc: 'Record individual transactions manually for cash accounts' },
            ].map((item) => (
              <div key={item.label} className="bg-muted/30 rounded-xl p-4 border border-border">
                <p className="font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
