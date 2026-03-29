import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Receipt, CheckCircle2, Clock, XCircle, Send, AlertCircle, RefreshCw
} from 'lucide-react';
import { getInvoices, getCustomers } from '@/app/actions';
import { CreateInvoiceModal } from '@/components/modals/create-invoice-modal';
import { ETIMSSubmitButton } from '@/components/accounting/etims-submit-button';
import { MarkPaidButton } from '@/components/accounting/mark-paid-button';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT:        { label: 'Draft',       color: 'bg-muted text-muted-foreground' },
  SENT:         { label: 'Sent',        color: 'bg-blue-500/10 text-blue-600' },
  PAID:         { label: 'Paid',        color: 'bg-emerald-500/10 text-emerald-600' },
  OVERDUE:      { label: 'Overdue',     color: 'bg-red-500/10 text-red-600' },
  CANCELLED:    { label: 'Cancelled',   color: 'bg-muted text-muted-foreground' },
};

const etimsConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PENDING:    { label: 'eTIMS Pending',  icon: Clock,        color: 'text-amber-500' },
  SUBMITTED:  { label: 'Submitted',      icon: Send,         color: 'text-blue-500' },
  ACCEPTED:   { label: 'KRA Accepted',   icon: CheckCircle2, color: 'text-emerald-500' },
  REJECTED:   { label: 'KRA Rejected',   icon: XCircle,      color: 'text-red-500' },
};

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
    getInvoices(),
    getCustomers(),
  ]);

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED')
    .reduce((s, i) => s + (i.totalAmount - i.amountPaid), 0);

  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((s, i) => s + i.totalAmount, 0);

  const pendingETIMS = invoices.filter((i) => i.etimsStatus === 'PENDING' && i.status !== 'DRAFT');
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-1">Invoices</h1>
            <p className="text-muted-foreground">Manage invoices, track payments & submit to KRA eTIMS</p>
          </div>
          <CreateInvoiceModal customerList={customers.map((c) => ({
            id: c.id, name: c.name,
            kraPin: (c as unknown as { kraPin?: string }).kraPin,
            email: c.email,
          }))} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-premium p-5">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Invoiced</p>
            <p className="text-xl font-bold text-foreground">KES {fmt(invoices.reduce((s, i) => s + i.totalAmount, 0))}</p>
          </div>
          <div className="card-premium p-5">
            <p className="text-xs text-muted-foreground font-medium mb-1">Outstanding</p>
            <p className="text-xl font-bold text-amber-500">KES {fmt(totalOutstanding)}</p>
          </div>
          <div className="card-premium p-5">
            <p className="text-xs text-muted-foreground font-medium mb-1">Collected</p>
            <p className="text-xl font-bold text-emerald-500">KES {fmt(totalPaid)}</p>
          </div>
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-medium">eTIMS Pending</p>
              {pendingETIMS.length > 0 && <AlertCircle className="w-4 h-4 text-amber-500" />}
            </div>
            <p className={`text-xl font-bold ${pendingETIMS.length > 0 ? 'text-amber-500' : 'text-foreground'}`}>
              {pendingETIMS.length}
            </p>
          </div>
        </div>

        {/* eTIMS Alert */}
        {pendingETIMS.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  {pendingETIMS.length} invoice{pendingETIMS.length > 1 ? 's' : ''} need eTIMS submission to KRA
                </p>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  All issued invoices must be submitted to KRA via eTIMS. Failure to do so may result in expenses being disallowed for tax purposes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Table */}
        <div className="card-premium overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <Receipt className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">All Invoices</h2>
            <span className="ml-auto text-sm text-muted-foreground">{invoices.length} total</span>
          </div>
          {invoices.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No invoices yet</p>
              <p className="text-sm text-muted-foreground/70">Create your first invoice to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left px-5 py-3 font-semibold">Invoice #</th>
                    <th className="text-left px-5 py-3 font-semibold">Customer</th>
                    <th className="text-left px-5 py-3 font-semibold">Date</th>
                    <th className="text-left px-5 py-3 font-semibold">Due</th>
                    <th className="text-right px-5 py-3 font-semibold">Amount</th>
                    <th className="text-right px-5 py-3 font-semibold">VAT</th>
                    <th className="text-center px-5 py-3 font-semibold">Status</th>
                    <th className="text-center px-5 py-3 font-semibold">eTIMS</th>
                    <th className="text-center px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const statusCfg = statusConfig[inv.status] ?? statusConfig.DRAFT;
                    const etimsCfg = inv.etimsStatus ? etimsConfig[inv.etimsStatus] : null;
                    const ETIMSIcon = etimsCfg?.icon ?? RefreshCw;

                    return (
                      <tr key={inv.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-semibold text-primary">{inv.invoiceNumber}</td>
                        <td className="px-5 py-3.5 text-foreground">
                          {inv.customer?.name ?? inv.customerName ?? '—'}
                          {inv.customerPin && (
                            <span className="block text-xs text-muted-foreground">{inv.customerPin}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {new Date(inv.issueDate).toLocaleDateString('en-KE')}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-KE') : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-semibold">KES {fmt(inv.totalAmount)}</td>
                        <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">KES {fmt(inv.totalVat)}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {etimsCfg && (
                            <div className={`flex items-center justify-center gap-1 text-xs font-medium ${etimsCfg.color}`}>
                              <ETIMSIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{etimsCfg.label}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {inv.etimsStatus === 'PENDING' && inv.status !== 'DRAFT' && (
                              <ETIMSSubmitButton invoiceId={inv.id} />
                            )}
                            {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                              <MarkPaidButton invoiceId={inv.id} balance={inv.totalAmount - inv.amountPaid} />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
