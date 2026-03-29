import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Hammer, Package, Box } from 'lucide-react';
import { getProductionRuns } from '@/app/actions';

export default async function ManufacturingOrdersPage() {
  const runs = await getProductionRuns();
  const totalUnits = runs.reduce((s, r) => s + r.quantityMade, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Manufacturing Orders</h1>
          <p className="text-muted-foreground">All production runs — each run consumes raw materials and increases finished product stock.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Hammer className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Runs</p>
              <h3 className="text-2xl font-bold text-foreground">{runs.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Box className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Units Manufactured</p>
              <h3 className="text-2xl font-bold text-foreground">{totalUnits}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-muted text-muted-foreground rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Unique Products Made</p>
              <h3 className="text-2xl font-bold text-foreground">
                {new Set(runs.map((r) => r.productId)).size}
              </h3>
            </div>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Production Run Log</h2></div>
          {runs.length === 0 ? (
            <div className="py-16 text-center">
              <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No runs yet. Start a production run from the Production dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Date</th>
                    <th className="py-3 px-6 font-semibold">Product</th>
                    <th className="py-3 px-6 font-semibold text-center">Units Made</th>
                    <th className="py-3 px-6 font-semibold">Raw Materials Used</th>
                    <th className="py-3 px-6 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-foreground">{r.product.name}</td>
                      <td className="py-4 px-6 text-center font-bold text-primary">{r.quantityMade}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {r.materials.map((m) => (
                            <span key={m.id} className="px-2 py-0.5 text-xs rounded-full bg-secondary/10 text-secondary">
                              {m.rawMaterial.name} ({m.quantityUsed} {m.rawMaterial.unit})
                            </span>
                          ))}
                          {r.materials.length === 0 && <span className="text-muted-foreground text-sm">—</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{r.notes ?? '—'}</td>
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
