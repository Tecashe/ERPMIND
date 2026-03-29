import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ListTree, Package, Box } from 'lucide-react';
import { getProducts, getRawMaterials, getProductionRuns } from '@/app/actions';

export default async function BillOfMaterialsPage() {
  const [products, rawMaterials, runs] = await Promise.all([
    getProducts(),
    getRawMaterials(),
    getProductionRuns(),
  ]);

  // Build a BoM: for each product that has been used in a run, aggregate material usage ratios
  const bomByProduct: Record<string, { productName: string; materials: Record<string, { name: string; unit: string; totalUsed: number; totalMade: number }> }> = {};

  for (const run of runs) {
    if (!bomByProduct[run.productId]) {
      bomByProduct[run.productId] = { productName: run.product.name, materials: {} };
    }
    for (const m of run.materials) {
      if (!bomByProduct[run.productId].materials[m.rawMaterialId]) {
        bomByProduct[run.productId].materials[m.rawMaterialId] = {
          name: m.rawMaterial.name,
          unit: m.rawMaterial.unit,
          totalUsed: 0,
          totalMade: 0,
        };
      }
      bomByProduct[run.productId].materials[m.rawMaterialId].totalUsed += m.quantityUsed;
      bomByProduct[run.productId].materials[m.rawMaterialId].totalMade += run.quantityMade;
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Bill of Materials</h1>
          <p className="text-muted-foreground">Derived from production run history — shows average material usage per unit produced.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Finished Products</p>
              <h3 className="text-2xl font-bold text-foreground">{products.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Box className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Raw Materials</p>
              <h3 className="text-2xl font-bold text-foreground">{rawMaterials.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-muted text-foreground rounded-xl"><ListTree className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Products with BoM</p>
              <h3 className="text-2xl font-bold text-foreground">{Object.keys(bomByProduct).length}</h3>
            </div>
          </div>
        </div>

        {Object.keys(bomByProduct).length === 0 ? (
          <div className="card-premium py-16 text-center">
            <ListTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No BoM data yet</h3>
            <p className="text-muted-foreground">Run production orders with raw materials to auto-generate bill of materials data here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(bomByProduct).map(([productId, bom]) => (
              <div key={productId} className="card-premium overflow-hidden">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">{bom.productName}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/30 text-muted-foreground text-sm">
                        <th className="py-3 px-6 font-semibold">Raw Material</th>
                        <th className="py-3 px-6 font-semibold text-center">Avg per Unit</th>
                        <th className="py-3 px-6 font-semibold text-center">Total Used</th>
                        <th className="py-3 px-6 font-semibold text-center">Total Runs Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(bom.materials).map((mat, i) => (
                        <tr key={i} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-6 font-semibold text-foreground">{mat.name}</td>
                          <td className="py-4 px-6 text-center font-mono text-primary">
                            {(mat.totalUsed / mat.totalMade).toFixed(2)} {mat.unit}
                          </td>
                          <td className="py-4 px-6 text-center text-muted-foreground">{mat.totalUsed} {mat.unit}</td>
                          <td className="py-4 px-6 text-center text-muted-foreground">{mat.totalMade} units</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
