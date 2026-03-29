import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ShoppingBag, Truck, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { getPurchaseOrders, getSuppliers } from '@/app/actions';
import { AddSupplierModal } from '@/components/modals/add-supplier-modal';
import { CreatePurchaseOrderModal } from '@/components/modals/create-purchase-order-modal';
import { ReceivePOButton } from '@/components/receive-po-button';

export default async function ProcurementPage() {
  const [orders, suppliers] = await Promise.all([getPurchaseOrders(), getSuppliers()]);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const totalSpend = orders.filter(o => o.status === 'RECEIVED').reduce((sum, o) => sum + o.totalCostKES, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Procurement</h1>
            <p className="text-muted-foreground text-lg">Manage purchase orders and suppliers.</p>
          </div>
          <div className="flex gap-3">
            <AddSupplierModal />
            <CreatePurchaseOrderModal suppliers={suppliers} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total POs</p>
              <h3 className="text-2xl font-bold text-foreground">{orders.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold text-foreground">{pendingCount}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Truck className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Spend (KES)</p>
              <h3 className="text-xl font-bold text-foreground">{totalSpend.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>

        {/* PO Table */}
        <div className="card-premium overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Purchase Orders</h2>
            {orders.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No purchase orders yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Supplier</th>
                      <th className="pb-3 text-sm font-semibold">Item</th>
                      <th className="pb-3 text-sm font-semibold">Qty</th>
                      <th className="pb-3 text-sm font-semibold">Unit Cost</th>
                      <th className="pb-3 text-sm font-semibold text-right">Total (KES)</th>
                      <th className="pb-3 text-sm font-semibold text-center">Status</th>
                      <th className="pb-3 text-sm font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((po) => (
                      <tr key={po.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-semibold text-foreground">{po.supplier.name}</td>
                        <td className="py-4 text-foreground">{po.product?.name ?? po.rawMaterial?.name ?? '—'}</td>
                        <td className="py-4 text-foreground">{po.quantity}</td>
                        <td className="py-4 font-mono text-muted-foreground">
                          {po.unitCostKES.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 font-mono font-bold text-foreground text-right">
                          {po.totalCostKES.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            po.status === 'RECEIVED' ? 'bg-primary/10 text-primary' :
                            po.status === 'CANCELLED' ? 'bg-muted text-muted-foreground' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          {po.status === 'PENDING' && <ReceivePOButton poId={po.id} />}
                          {po.status !== 'PENDING' && <CheckCircle className="w-5 h-5 text-primary mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Supplier List */}
        {suppliers.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Suppliers ({suppliers.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((s) => (
                  <div key={s.id} className="p-4 bg-muted/20 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-foreground">{s.name}</h3>
                    </div>
                    {s.phone && <p className="text-sm text-muted-foreground">{s.phone}</p>}
                    {s.email && <p className="text-sm text-muted-foreground">{s.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
