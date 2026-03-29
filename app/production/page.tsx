// import React from 'react';
// import { DashboardLayout } from '@/components/dashboard-layout';
// import { Hammer, Package, Archive, FlaskConical } from 'lucide-react';
// import { getProductionRuns, getProducts, getRawMaterials } from '@/app/actions';

// export default async function ProductionPage() {
//   const [runs, products, rawMaterials] = await Promise.all([
//     getProductionRuns(),
//     getProducts(),
//     getRawMaterials(),
//   ]);

//   const totalUnitsProduced = runs.reduce((sum, r) => sum + r.quantityMade, 0);

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div>
//             <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Production</h1>
//             <p className="text-muted-foreground text-lg">Track manufacturing runs and raw material consumption.</p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-primary/10 text-primary rounded-xl"><Hammer className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Total Production Runs</p>
//               <h3 className="text-2xl font-bold text-foreground">{runs.length}</h3>
//             </div>
//           </div>
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Total Units Produced</p>
//               <h3 className="text-2xl font-bold text-foreground">{totalUnitsProduced}</h3>
//             </div>
//           </div>
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><FlaskConical className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Raw Materials Tracked</p>
//               <h3 className="text-2xl font-bold text-foreground">{rawMaterials.length}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Production Runs Table */}
//         <div className="card-premium overflow-hidden mb-10">
//           <div className="p-6 md:p-8">
//             <h2 className="text-2xl font-bold text-foreground mb-6">Production Runs</h2>
//             {runs.length === 0 ? (
//               <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
//                 <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-foreground mb-2">No production runs recorded</h3>
//                 <p className="text-muted-foreground">
//                   Add raw materials via Procurement, then come back here to log production runs.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b-2 border-border/50 text-muted-foreground">
//                       <th className="pb-3 text-sm font-semibold">Date</th>
//                       <th className="pb-3 text-sm font-semibold">Product Produced</th>
//                       <th className="pb-3 text-sm font-semibold text-center">Units Made</th>
//                       <th className="pb-3 text-sm font-semibold">Materials Used</th>
//                       <th className="pb-3 text-sm font-semibold">Notes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {runs.map((run) => (
//                       <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                         <td className="py-4 text-sm text-muted-foreground">
//                           {new Date(run.createdAt).toLocaleDateString('en-KE')}
//                         </td>
//                         <td className="py-4 font-semibold text-foreground">{run.product.name}</td>
//                         <td className="py-4 text-center">
//                           <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
//                             {run.quantityMade}
//                           </span>
//                         </td>
//                         <td className="py-4 text-sm text-muted-foreground">
//                           {run.materials.length === 0
//                             ? '—'
//                             : run.materials.map(m => `${m.quantityUsed} ${m.rawMaterial.unit} of ${m.rawMaterial.name}`).join(', ')
//                           }
//                         </td>
//                         <td className="py-4 text-sm text-muted-foreground">{run.notes ?? '—'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Raw Material Stock */}
//         {rawMaterials.length > 0 && (
//           <div className="card-premium overflow-hidden">
//             <div className="p-6 md:p-8">
//               <h2 className="text-2xl font-bold text-foreground mb-6">Raw Material Stock</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {rawMaterials.map((m) => (
//                   <div key={m.id} className={`p-4 rounded-xl border ${m.stockLevel <= m.lowStockAlert ? 'border-destructive/40 bg-destructive/5' : 'border-border/50 bg-muted/20'}`}>
//                     <div className="flex items-center gap-2 mb-2">
//                       <Archive className="w-4 h-4 text-muted-foreground" />
//                       <h3 className="font-semibold text-foreground">{m.name}</h3>
//                     </div>
//                     <p className={`text-2xl font-bold ${m.stockLevel <= m.lowStockAlert ? 'text-destructive' : 'text-primary'}`}>
//                       {m.stockLevel} <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
//                     </p>
//                     {m.stockLevel <= m.lowStockAlert && (
//                       <p className="text-xs text-destructive mt-1">⚠ Below alert level ({m.lowStockAlert} {m.unit})</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Hammer, Package, Archive, FlaskConical } from 'lucide-react';
import { getProductionRuns, getProducts, getRawMaterials } from '@/app/actions';

type Material = {
  quantityUsed: number;
  rawMaterial: { unit: string; name: string };
};

type Run = {
  id: string;
  createdAt: Date;
  quantityMade: number;
  notes?: string | null;
  product: { name: string };
  materials: Material[];
};

type RawMaterial = {
  id: string;
  name: string;
  stockLevel: number;
  lowStockAlert: number;
  unit: string;
};

export default async function ProductionPage() {
  const [runs, products, rawMaterials] = await Promise.all([
    getProductionRuns(),
    getProducts(),
    getRawMaterials(),
  ]);

  const totalUnitsProduced = (runs as Run[]).reduce(
    (sum: number, r: Run) => sum + r.quantityMade,
    0
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Production</h1>
            <p className="text-muted-foreground text-lg">Track manufacturing runs and raw material consumption.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Hammer className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Production Runs</p>
              <h3 className="text-2xl font-bold text-foreground">{runs.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Units Produced</p>
              <h3 className="text-2xl font-bold text-foreground">{totalUnitsProduced}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><FlaskConical className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Raw Materials Tracked</p>
              <h3 className="text-2xl font-bold text-foreground">{rawMaterials.length}</h3>
            </div>
          </div>
        </div>

        {/* Production Runs Table */}
        <div className="card-premium overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Production Runs</h2>
            {runs.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No production runs recorded</h3>
                <p className="text-muted-foreground">
                  Add raw materials via Procurement, then come back here to log production runs.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Date</th>
                      <th className="pb-3 text-sm font-semibold">Product Produced</th>
                      <th className="pb-3 text-sm font-semibold text-center">Units Made</th>
                      <th className="pb-3 text-sm font-semibold">Materials Used</th>
                      <th className="pb-3 text-sm font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(runs as Run[]).map((run: Run) => (
                      <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(run.createdAt).toLocaleDateString('en-KE')}
                        </td>
                        <td className="py-4 font-semibold text-foreground">{run.product.name}</td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                            {run.quantityMade}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {run.materials.length === 0
                            ? '—'
                            : run.materials
                              .map((m: Material) =>
                                `${m.quantityUsed} ${m.rawMaterial.unit} of ${m.rawMaterial.name}`
                              )
                              .join(', ')}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{run.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Raw Material Stock */}
        {rawMaterials.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Raw Material Stock</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(rawMaterials as RawMaterial[]).map((m: RawMaterial) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border ${m.stockLevel <= m.lowStockAlert
                        ? 'border-destructive/40 bg-destructive/5'
                        : 'border-border/50 bg-muted/20'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Archive className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{m.name}</h3>
                    </div>
                    <p className={`text-2xl font-bold ${m.stockLevel <= m.lowStockAlert ? 'text-destructive' : 'text-primary'}`}>
                      {m.stockLevel}{' '}
                      <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
                    </p>
                    {m.stockLevel <= m.lowStockAlert && (
                      <p className="text-xs text-destructive mt-1">
                        ⚠ Below alert level ({m.lowStockAlert} {m.unit})
                      </p>
                    )}
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