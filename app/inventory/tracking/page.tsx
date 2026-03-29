import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { getProducts, getRawMaterials } from '@/app/actions';

export default async function StockTrackingPage() {
  const [products, rawMaterials] = await Promise.all([
    getProducts(),
    getRawMaterials(),
  ]);

  const lowStockProducts = products.filter((p) => p.stockLevel <= p.lowStockAlert);
  const lowStockMaterials = rawMaterials.filter((m) => m.stockLevel <= m.lowStockAlert);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Stock Tracking</h1>
          <p className="text-muted-foreground">Live inventory levels — updated automatically by Sales and Production modules.</p>
        </div>

        {/* Alerts */}
        {(lowStockProducts.length > 0 || lowStockMaterials.length > 0) && (
          <div className="card-premium border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">
              {lowStockProducts.length + lowStockMaterials.length} item(s) below minimum stock threshold — raise purchase orders via Procurement.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Finished Products</p>
              <h3 className="text-2xl font-bold text-foreground">{products.length} SKUs</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Raw Materials</p>
              <h3 className="text-2xl font-bold text-foreground">{rawMaterials.length} items</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-destructive">{lowStockProducts.length + lowStockMaterials.length}</h3>
            </div>
          </div>
        </div>

        {/* Finished Products */}
        <div className="card-premium overflow-hidden mb-6">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Finished Goods</h2></div>
          {products.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground"><Package className="w-10 h-10 mx-auto mb-3 opacity-40" />No products in inventory</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold">SKU</th>
                    <th className="py-3 px-6 font-semibold text-right">Price (KES)</th>
                    <th className="py-3 px-6 font-semibold text-center">Stock</th>
                    <th className="py-3 px-6 font-semibold text-center">Alert At</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
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
                        <td className="py-4 px-6 text-center text-muted-foreground">{p.lowStockAlert}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
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

        {/* Raw Materials */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Raw Materials</h2></div>
          {rawMaterials.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground"><TrendingDown className="w-10 h-10 mx-auto mb-3 opacity-40" />No raw materials on record</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Material</th>
                    <th className="py-3 px-6 font-semibold">Unit</th>
                    <th className="py-3 px-6 font-semibold text-center">Stock Level</th>
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
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
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
