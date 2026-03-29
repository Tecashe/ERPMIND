import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { getProducts, getRawMaterials, getSales } from '@/app/actions';

export default async function InventoryReportPage() {
  const [products, rawMaterials, sales] = await Promise.all([
    getProducts(),
    getRawMaterials(),
    getSales(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const totalStockValue = products.reduce((s, p) => s + p.priceKES * p.stockLevel, 0);
  const lowStock = products.filter((p) => p.stockLevel <= p.lowStockAlert).length;
  const lowMaterials = rawMaterials.filter((m) => m.stockLevel <= m.lowStockAlert).length;

  // Units sold per product
  const soldByProduct = sales.reduce<Record<string, number>>((acc, s) => {
    acc[s.productId] = (acc[s.productId] ?? 0) + s.quantity;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Inventory Reports</h1>
          <p className="text-muted-foreground">Real-time stock health report — cross-linked with Sales and Production modules.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Stock Value</p>
            <h3 className="text-lg font-bold text-primary">{fmt(totalStockValue)}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Products</p>
            <h3 className="text-2xl font-bold text-foreground">{products.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-destructive">{lowStock + lowMaterials}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Raw Materials</p>
            <h3 className="text-2xl font-bold text-foreground">{rawMaterials.length}</h3>
          </div>
        </div>

        <div className="card-premium overflow-hidden mb-6">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Product Stock vs. Sales</h2>
          </div>
          {products.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">SKU</th>
                    <th className="py-3 px-6 font-semibold text-right">Price (KES)</th>
                    <th className="py-3 px-6 font-semibold text-center">Stock</th>
                    <th className="py-3 px-6 font-semibold text-right">Stock Value</th>
                    <th className="py-3 px-6 font-semibold text-center">Sold</th>
                    <th className="py-3 px-6 font-semibold text-center">Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isLow = p.stockLevel <= p.lowStockAlert;
                    return (
                      <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6 font-semibold text-foreground">{p.name}</td>
                        <td className="py-4 px-6 font-mono text-sm text-muted-foreground">{p.sku}</td>
                        <td className="py-4 px-6 text-right font-mono">{p.priceKES.toLocaleString('en-KE')}</td>
                        <td className={`py-4 px-6 text-center font-bold ${isLow ? 'text-destructive' : 'text-primary'}`}>{p.stockLevel}</td>
                        <td className="py-4 px-6 text-right font-mono text-muted-foreground">
                          {fmt(p.priceKES * p.stockLevel)}
                        </td>
                        <td className="py-4 px-6 text-center text-muted-foreground">{soldByProduct[p.id] ?? 0}</td>
                        <td className="py-4 px-6 text-center">
                          {isLow ? (
                            <AlertTriangle className="w-4 h-4 text-destructive mx-auto" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
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

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <TrendingDown className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Raw Material Stock</h2>
          </div>
          {rawMaterials.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No raw materials found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Material</th>
                    <th className="py-3 px-6 font-semibold">Unit</th>
                    <th className="py-3 px-6 font-semibold text-center">In Stock</th>
                    <th className="py-3 px-6 font-semibold text-center">Alert At</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map((m) => {
                    const isLow = m.stockLevel <= m.lowStockAlert;
                    return (
                      <tr key={m.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6 font-semibold text-foreground">{m.name}</td>
                        <td className="py-4 px-6 text-muted-foreground">{m.unit}</td>
                        <td className={`py-4 px-6 text-center font-bold ${isLow ? 'text-destructive' : 'text-primary'}`}>{m.stockLevel}</td>
                        <td className="py-4 px-6 text-center text-muted-foreground">{m.lowStockAlert}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                            {isLow ? 'LOW' : 'OK'}
                          </span>
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
