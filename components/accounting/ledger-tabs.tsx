'use client'

import { useState } from 'react';

type TrialLine = {
  id: string; code: string; name: string; type: string; subType?: string | null;
  totalDebit: number; totalCredit: number; balance: number;
};
type PNL = {
  totalRevenue: number; totalExpenses: number; netProfit: number;
  revenueBreakdown: Record<string, number>;
  expenseBreakdown: Record<string, number>;
};
type Journal = {
  id: string; reference: string; description: string; entryDate: Date | string;
  status: string; source?: string | null;
  lines: { id: string; account: { name: string; code: string }; debit: number; credit: number }[];
};

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

const ACCOUNT_TYPE_ORDER = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
const TYPE_COLORS: Record<string, string> = {
  ASSET: 'text-blue-500 bg-blue-500/10',
  LIABILITY: 'text-red-500 bg-red-500/10',
  EQUITY: 'text-purple-500 bg-purple-500/10',
  REVENUE: 'text-emerald-500 bg-emerald-500/10',
  EXPENSE: 'text-orange-500 bg-orange-500/10',
};

export function LedgerTabs({ trial, pnl, journals }: {
  trial: TrialLine[];
  pnl: PNL;
  journals: Journal[];
}) {
  const [activeTab, setActiveTab] = useState<'trial' | 'pnl' | 'journals'>('journals');

  const tabs = [
    { id: 'journals', label: 'Journal Entries' },
    { id: 'trial',   label: 'Trial Balance' },
    { id: 'pnl',     label: 'P&L Statement' },
  ] as const;

  const byType = ACCOUNT_TYPE_ORDER.map((type) => ({
    type,
    accounts: trial.filter((a) => a.type === type),
  })).filter((g) => g.accounts.length > 0);

  return (
    <div className="card-premium overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trial Balance */}
      {activeTab === 'trial' && (
        <div className="overflow-x-auto">
          {trial.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>No accounts in Chart of Accounts yet. Run the CoA seed script to get started.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold">Code</th>
                  <th className="text-left px-5 py-3 font-semibold">Account Name</th>
                  <th className="text-center px-5 py-3 font-semibold">Type</th>
                  <th className="text-right px-5 py-3 font-semibold">Debit</th>
                  <th className="text-right px-5 py-3 font-semibold">Credit</th>
                  <th className="text-right px-5 py-3 font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {byType.map(({ type, accounts }) => (
                  <>
                    <tr key={`header-${type}`} className="bg-muted/20">
                      <td colSpan={6} className="px-5 py-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[type]}`}>
                          {type}
                        </span>
                      </td>
                    </tr>
                    {accounts.map((a) => (
                      <tr key={a.id} className="border-t border-border hover:bg-muted/20">
                        <td className="px-5 py-3 font-mono text-muted-foreground text-xs">{a.code}</td>
                        <td className="px-5 py-3 font-medium text-foreground">{a.name}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type]}`}>
                            {a.subType ?? a.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">
                          {a.totalDebit > 0 ? fmt(a.totalDebit) : '—'}
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">
                          {a.totalCredit > 0 ? fmt(a.totalCredit) : '—'}
                        </td>
                        <td className={`px-5 py-3 text-right font-mono font-semibold tabular-nums ${
                          a.balance >= 0 ? 'text-foreground' : 'text-red-500'
                        }`}>
                          {Math.abs(a.balance) > 0 ? `${a.balance < 0 ? '-' : ''}${fmt(Math.abs(a.balance))}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* P&L */}
      {activeTab === 'pnl' && (
        <div className="p-6 max-w-2xl">
          <h3 className="font-bold text-foreground text-lg mb-6">Profit & Loss Statement</h3>

          {/* Revenue */}
          <div className="mb-6">
            <h4 className="font-semibold text-emerald-600 mb-3 uppercase text-xs tracking-wider">Revenue</h4>
            {Object.entries(pnl.revenueBreakdown).length === 0 ? (
              <p className="text-muted-foreground text-sm">No revenue posted via journal entries yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(pnl.revenueBreakdown).map(([name, amount]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono font-semibold text-emerald-600">KES {fmt(amount)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total Revenue</span>
                  <span className="font-mono text-emerald-600">KES {fmt(pnl.totalRevenue)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Expenses */}
          <div className="mb-6">
            <h4 className="font-semibold text-red-500 mb-3 uppercase text-xs tracking-wider">Expenses</h4>
            {Object.entries(pnl.expenseBreakdown).length === 0 ? (
              <p className="text-muted-foreground text-sm">No expenses posted via journal entries yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(pnl.expenseBreakdown).map(([name, amount]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono font-semibold text-red-500">KES {fmt(amount)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total Expenses</span>
                  <span className="font-mono text-red-500">KES {fmt(pnl.totalExpenses)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Net */}
          <div className={`rounded-xl p-5 border ${
            pnl.netProfit >= 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Net {pnl.netProfit >= 0 ? 'Profit' : 'Loss'}</span>
              <span className={`font-mono text-2xl font-bold ${pnl.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {pnl.netProfit < 0 ? '-' : ''}KES {fmt(Math.abs(pnl.netProfit))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      {activeTab === 'journals' && (
        <div>
          {journals.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>No journal entries yet. Transactions from Sales, Payroll, and Procurement will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {journals.map((entry) => {
                const totalDebit = entry.lines.reduce((s, l) => s + l.debit, 0);
                return (
                  <div key={entry.id} className="px-6 py-4 hover:bg-muted/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.reference} · {new Date(entry.entryDate).toLocaleDateString('en-KE')}
                          {entry.source && ` · ${entry.source}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-foreground">KES {fmt(totalDebit)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          entry.status === 'POSTED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                        }`}>{entry.status}</span>
                      </div>
                    </div>
                    <div className="ml-4 space-y-1">
                      {entry.lines.map((line) => (
                        <div key={line.id} className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-mono">{line.account.code}</span>
                          <span className="flex-1">{line.account.name}</span>
                          {line.debit > 0 && <span className="text-foreground font-mono">Dr {fmt(line.debit)}</span>}
                          {line.credit > 0 && <span className="text-primary font-mono">Cr {fmt(line.credit)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
