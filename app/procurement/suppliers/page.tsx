import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Truck, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { getSuppliers, getPurchaseOrders } from '@/app/actions';

export default async function SuppliersPage() {
  const [suppliers, orders] = await Promise.all([
    getSuppliers(),
    getPurchaseOrders(),
  ]);

  // Count POs per supplier
  const poCountBySupplier = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.supplierId] = (acc[o.supplierId] ?? 0) + 1;
    return acc;
  }, {});

  const totalBySupplier = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.supplierId] = (acc[o.supplierId] ?? 0) + o.totalCostKES;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Supplier Management</h1>
            <p className="text-muted-foreground">All registered suppliers — track order history and spending per vendor.</p>
          </div>
          <div className="card-premium px-5 py-3 flex items-center gap-3">
            <Truck className="w-5 h-5 text-secondary" />
            <span className="font-bold text-foreground">{suppliers.length}</span>
            <span className="text-muted-foreground text-sm">suppliers</span>
          </div>
        </div>

        {suppliers.length === 0 ? (
          <div className="card-premium py-16 text-center">
            <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No suppliers on record</h3>
            <p className="text-muted-foreground">Add suppliers from the Procurement dashboard to manage vendor relationships.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {suppliers.map((sup) => (
              <div key={sup.id} className="card-premium p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground truncate">{sup.name}</h3>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  {sup.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{sup.phone}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{sup.address}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Purchase Orders</span>
                    </div>
                    <span className="font-bold text-foreground">{poCountBySupplier[sup.id] ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spend</span>
                    <span className="font-mono font-bold text-destructive">
                      KES {(totalBySupplier[sup.id] ?? 0).toLocaleString('en-KE')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
