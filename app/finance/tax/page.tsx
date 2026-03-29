import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  FileCheck, AlertCircle, CheckCircle2, Clock, Receipt, Users, Building2, TrendingUp
} from 'lucide-react';
import { getTaxFilingPeriods } from '@/app/actions/accounting';
import { getSales } from '@/app/actions';
import { TaxActions } from '@/components/accounting/tax-actions';

const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

export default async function TaxCompliancePage() {
  const [sales, filingPeriods] = await Promise.all([
    getSales(),
    getTaxFilingPeriods(),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const paidSales = sales.filter((s) => s.status === 'PAID');
  const monthSales = paidSales.filter((s) => {
    const d = new Date(s.saleDate);
    return d >= startOfMonth && d <= endOfMonth;
  });

  const totalVatAllTime = paidSales.reduce((s, sale) => s + sale.vatAmount, 0);
  const totalVatMonth = monthSales.reduce((s, sale) => s + sale.vatAmount, 0);
  const totalRevenueMonth = monthSales.reduce((s, sale) => s + sale.totalAmount, 0);
  const vatRate = 16;

  // Filing calendar
  const vatDueDate = new Date(now.getFullYear(), now.getMonth() + 1, 20);
  const payeDueDate = new Date(now.getFullYear(), now.getMonth() + 1, 9);
  const daysToVAT = Math.ceil((vatDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysToPAYE = Math.ceil((payeDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Monthly VAT breakdown
  const byMonth = paidSales.reduce<Record<string, { gross: number; vat: number; count: number }>>((acc, s) => {
    const key = new Date(s.saleDate).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = { gross: 0, vat: 0, count: 0 };
    acc[key].gross += s.totalAmount;
    acc[key].vat += s.vatAmount;
    acc[key].count++;
    return acc;
  }, {});

  const complianceTiles = [
    {
      label: 'VAT 16%',
      dueLabel: `Due 20th — ${daysToVAT > 0 ? `${daysToVAT} days` : 'Overdue'}`,
      amount: totalVatMonth,
      icon: Receipt,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      urgent: daysToVAT <= 5,
      desc: 'Monthly Output VAT payable to KRA',
    },
    {
      label: 'PAYE',
      dueLabel: `Due 9th — ${daysToPAYE > 0 ? `${daysToPAYE} days` : 'Overdue'}`,
      amount: 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      urgent: daysToPAYE <= 5,
      desc: 'Employee income tax — run payroll to calculate',
    },
    {
      label: 'NSSF',
      dueLabel: `Due 9th`,
      amount: 0,
      icon: Building2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      urgent: false,
      desc: '6% employee + 6% employer (tiered)',
    },
    {
      label: 'SHIF',
      dueLabel: `Due 9th`,
      amount: 0,
      icon: TrendingUp,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      urgent: false,
      desc: '2.75% of gross (min KES 300)',
    },
    {
      label: 'AHL',
      dueLabel: `Due 9th`,
      amount: 0,
      icon: Building2,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      urgent: false,
      desc: 'Affordable Housing Levy — 1.5% employee + 1.5% employer',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <FileCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">Tax & Compliance</h1>
              <p className="text-muted-foreground">KRA eTIMS · VAT · PAYE · NSSF · SHIF · AHL — Kenya statutory obligations</p>
            </div>
          </div>
        </div>

        {/* Urgency Alerts */}
        {(daysToVAT <= 5 || daysToPAYE <= 5) && (
          <div className="mb-6 space-y-2">
            {daysToVAT <= 5 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  VAT return due on the 20th — {daysToVAT <= 0 ? 'OVERDUE!' : `${daysToVAT} days remaining`}
                </span>
              </div>
            )}
            {daysToPAYE <= 5 && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  PAYE/NSSF/SHIF due on the 9th — {daysToPAYE <= 0 ? 'OVERDUE!' : `${daysToPAYE} days remaining`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* VAT KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">This Month's Revenue</p>
            <p className="text-2xl font-bold text-foreground">{fmt(totalRevenueMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">{monthSales.length} transactions</p>
          </div>
          <div className="card-premium p-6 border-primary/20">
            <p className="text-sm text-muted-foreground font-medium mb-1">VAT Payable This Month ({vatRate}%)</p>
            <p className="text-2xl font-bold text-primary">{fmt(totalVatMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">Due by 20th of next month</p>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">All-Time VAT Collected</p>
            <p className="text-2xl font-bold text-foreground">{fmt(totalVatAllTime)}</p>
            <p className="text-xs text-muted-foreground mt-1">{paidSales.length} total paid sales</p>
          </div>
        </div>

        {/* Statutory Obligations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Monthly Statutory Obligations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceTiles.map((tile) => (
              <div key={tile.label} className={`card-premium p-5 ${tile.urgent ? 'border-red-500/40' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${tile.bg}`}>
                    <tile.icon className={`w-5 h-5 ${tile.color}`} />
                  </div>
                  {tile.urgent && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <p className="font-bold text-foreground text-base">{tile.label}</p>
                <p className="text-xs text-muted-foreground mb-2">{tile.desc}</p>
                {tile.amount > 0 ? (
                  <p className={`text-lg font-bold ${tile.color}`}>{fmt(tile.amount)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Run payroll to calculate</p>
                )}
                <p className={`text-xs mt-1 font-medium ${tile.urgent ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {tile.dueLabel}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* eTIMS Section */}
        <div className="mb-8 card-premium overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">KRA eTIMS — Electronic Tax Invoicing</h2>
              <p className="text-xs text-muted-foreground">OSCU Integration · Sandbox Mode Active</p>
            </div>
            <div className="ml-auto">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600">
                Sandbox Mode
              </span>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'System', value: 'OSCU (KRA-Hosted)', icon: Building2 },
              { label: 'KRA PIN', value: process.env.ETIMS_KRA_PIN ?? 'Not configured', icon: CheckCircle2 },
              { label: 'Device Serial', value: process.env.ETIMS_DEVICE_SERIAL ?? 'Sandbox', icon: FileCheck },
              { label: 'Mode', value: process.env.ETIMS_SANDBOX === 'false' ? 'Production' : 'Sandbox', icon: AlertCircle },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-mono text-sm font-semibold text-foreground truncate">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3 border border-border">
              <strong className="text-foreground">Setup required:</strong> Add <code>ETIMS_URL</code>, <code>ETIMS_KRA_PIN</code>, <code>ETIMS_DEVICE_SERIAL</code>, and <code>ETIMS_SANDBOX=false</code> to your <code>.env</code> file when switching to production. Visit <strong>etims.kra.go.ke</strong> to register your device.
            </p>
          </div>
        </div>

        {/* Monthly VAT Breakdown Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <Receipt className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Monthly VAT Summary (Output Tax)</h2>
          </div>
          {Object.keys(byMonth).length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No paid sales yet to report VAT on.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    <th className="text-left px-6 py-3 font-semibold">Period</th>
                    <th className="text-center px-6 py-3 font-semibold">Transactions</th>
                    <th className="text-right px-6 py-3 font-semibold">Gross Revenue</th>
                    <th className="text-right px-6 py-3 font-semibold">Net (excl. VAT)</th>
                    <th className="text-right px-6 py-3 font-semibold">Output VAT (16%)</th>
                    <th className="text-center px-6 py-3 font-semibold">Filing Status</th>
                    <th className="text-center px-6 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byMonth).map(([month, data]) => {
                    const filed = filingPeriods.find((p) => p.period === month && p.taxType === 'VAT');
                    return (
                      <tr key={month} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{month}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{data.count}</td>
                        <td className="px-6 py-4 text-right font-mono">{fmt(data.gross)}</td>
                        <td className="px-6 py-4 text-right font-mono text-muted-foreground">{fmt(data.gross - data.vat)}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-primary">{fmt(data.vat)}</td>
                        <td className="px-6 py-4 text-center">
                          {filed ? (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                              Filed ✓
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {!filed && (
                            <TaxActions
                              month={month}
                              vatAmount={data.vat}
                              grossAmount={data.gross}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filing History */}
        {filingPeriods.length > 0 && (
          <div className="mt-6 card-premium overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-bold text-foreground">Filing History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    <th className="text-left px-5 py-3 font-semibold">Tax Type</th>
                    <th className="text-left px-5 py-3 font-semibold">Period</th>
                    <th className="text-right px-5 py-3 font-semibold">Tax Amount</th>
                    <th className="text-center px-5 py-3 font-semibold">Due Date</th>
                    <th className="text-center px-5 py-3 font-semibold">Filed On</th>
                    <th className="text-center px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filingPeriods.map((fp) => (
                    <tr key={fp.id} className="border-t border-border hover:bg-muted/20">
                      <td className="px-5 py-3.5 font-semibold">{fp.taxType}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{fp.period}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">{fmt(fp.taxAmount)}</td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground">
                        {new Date(fp.dueDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground">
                        {fp.filedAt ? new Date(fp.filedAt).toLocaleDateString('en-KE') : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          fp.status === 'FILED' ? 'bg-emerald-500/10 text-emerald-600' :
                          fp.status === 'LATE' ? 'bg-red-500/10 text-red-600' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>{fp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
