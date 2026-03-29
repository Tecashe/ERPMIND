import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { getSales } from '@/app/actions';

export default async function InvoicingPage() {
  const sales = await getSales();
  const paidSales = sales.filter((s) => s.status === 'PAID');

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
  const totalInvoiced = paidSales.reduce((s, r) => s + r.totalAmount, 0);
  const totalVAT = paidSales.reduce((s, r) => s + r.vatAmount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Invoicing</h1>
          <p className="text-muted-foreground">All issued invoices generated from paid sales transactions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Invoiced</p>
            <h3 className="text-2xl font-bold text-primary">{fmt(totalInvoiced)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total VAT Charged</p>
            <h3 className="text-2xl font-bold text-foreground">{fmt(totalVAT)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Invoices Issued</p>
            <h3 className="text-2xl font-bold text-foreground">{paidSales.length}</h3>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Invoice Register</h2>
          </div>
          {paidSales.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices generated yet. Paid sales automatically create invoice records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Invoice #</th>
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Customer</th>
                    <th className="py-3 px-6 font-semibold">Line Item</th>
                    <th className="py-3 px-6 font-semibold text-right">Subtotal</th>
                    <th className="py-3 px-6 font-semibold text-right">VAT (16%)</th>
                    <th className="py-3 px-6 font-semibold text-right">Total</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paidSales.map((s, i) => (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm font-mono text-muted-foreground">INV-{String(i + 1).padStart(4, '0')}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-medium text-foreground">{s.customer?.name ?? 'Walk-in'}</td>
                      <td className="py-4 px-6 text-muted-foreground">{s.quantity}× {s.product.name}</td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">
                        {(s.totalAmount - s.vatAmount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">
                        {s.vatAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">
                        {s.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary flex items-center gap-1 justify-center">
                          <CheckCircle className="w-3 h-3" /> PAID
                        </span>
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
