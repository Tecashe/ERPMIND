import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ShoppingBag, AlertCircle, Package, CheckCircle, XCircle } from 'lucide-react';
import { getPurchaseOrders, getSuppliers } from '@/app/actions';

export default async function PurchaseOrdersPage() {
  const [orders, suppliers] = await Promise.all([
    getPurchaseOrders(),
    getSuppliers(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const pending = orders.filter((o) => o.status === 'PENDING');
  const received = orders.filter((o) => o.status === 'RECEIVED');
  const cancelled = orders.filter((o) => o.status === 'CANCELLED');

  const statusIcon = (status: string) => {
    if (status === 'PENDING') return <AlertCircle className="w-4 h-4 text-destructive" />;
    if (status === 'RECEIVED') return <CheckCircle className="w-4 h-4 text-primary" />;
    return <XCircle className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Purchase Orders</h1>
          <p className="text-muted-foreground">All POs — receiving a PO updates Inventory and creates an Expense in Finance automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total POs</p>
            <h3 className="text-2xl font-bold text-foreground">{orders.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Pending</p>
            <h3 className="text-2xl font-bold text-destructive">{pending.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Received</p>
            <h3 className="text-2xl font-bold text-primary">{received.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Suppliers</p>
            <h3 className="text-2xl font-bold text-foreground">{suppliers.length}</h3>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">All Purchase Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No purchase orders yet. Create a PO from the Procurement dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Supplier</th>
                    <th className="py-3 px-6 font-semibold">Item</th>
                    <th className="py-3 px-6 font-semibold text-center">Qty</th>
                    <th className="py-3 px-6 font-semibold text-right">Unit Cost</th>
                    <th className="py-3 px-6 font-semibold text-right">Total</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{o.supplier.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {o.product?.name ?? o.rawMaterial?.name ?? 'General Order'}
                      </td>
                      <td className="py-4 px-6 text-center text-foreground">{o.quantity}</td>
                      <td className="py-4 px-6 text-right font-mono text-muted-foreground">{fmt(o.unitCostKES)}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-foreground">{fmt(o.totalCostKES)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {statusIcon(o.status)}
                          <span className={`text-xs font-medium ${
                            o.status === 'PENDING' ? 'text-destructive' :
                            o.status === 'RECEIVED' ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {o.status}
                          </span>
                        </div>
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
