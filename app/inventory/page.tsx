import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, AlertTriangle, Archive, TrendingUp } from 'lucide-react';
import { getProducts, getRawMaterials } from '@/app/actions';
import { AddProductModal } from '@/components/modals/add-product-modal';

export default async function InventoryPage() {
  const [products, rawMaterials] = await Promise.all([getProducts(), getRawMaterials()]);
  const lowStockItems = products.filter(p => p.stockLevel <= p.lowStockAlert);
  const totalValue = products.reduce((sum, p) => sum + (p.priceKES * p.stockLevel), 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Inventory</h1>
            <p className="text-muted-foreground text-lg">Manage products and track stock levels.</p>
          </div>
          <AddProductModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Products</p>
              <h3 className="text-2xl font-bold text-foreground">{products.length}</h3>
            </div>
          </div>
          <div className={`card-premium p-6 flex items-center gap-4 ${lowStockItems.length > 0 ? 'border-destructive/40' : ''}`}>
            <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-foreground">{lowStockItems.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Stock Value (KES)</p>
              <h3 className="text-xl font-bold text-foreground">{totalValue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockItems.length > 0 && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockItems.map(p => `${p.name} (${p.stockLevel} left)`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="card-premium overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Products & Stock</h2>
            {products.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Add your first product to start tracking inventory.</p>
                <AddProductModal />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">SKU</th>
                      <th className="pb-3 text-sm font-semibold">Name</th>
                      <th className="pb-3 text-sm font-semibold text-right">Price (KES)</th>
                      <th className="pb-3 text-sm font-semibold text-center">Stock</th>
                      <th className="pb-3 text-sm font-semibold text-right">Value (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 text-sm font-mono text-muted-foreground">{p.sku}</td>
                        <td className="py-4 font-semibold text-foreground">{p.name}</td>
                        <td className="py-4 font-mono text-foreground text-right">
                          {p.priceKES.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            p.stockLevel <= p.lowStockAlert
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {p.stockLevel} units
                          </span>
                        </td>
                        <td className="py-4 font-mono font-bold text-foreground text-right">
                          {(p.priceKES * p.stockLevel).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Raw Materials */}
        {rawMaterials.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Raw Materials</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Material</th>
                      <th className="pb-3 text-sm font-semibold">Unit</th>
                      <th className="pb-3 text-sm font-semibold text-center">Stock</th>
                      <th className="pb-3 text-sm font-semibold text-center">Alert Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawMaterials.map((m) => (
                      <tr key={m.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-semibold text-foreground">{m.name}</td>
                        <td className="py-4 text-muted-foreground">{m.unit}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            m.stockLevel <= m.lowStockAlert ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                          }`}>
                            {m.stockLevel} {m.unit}
                          </span>
                        </td>
                        <td className="py-4 text-muted-foreground text-center">{m.lowStockAlert} {m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
