// import React from 'react';
// import { DashboardLayout } from '@/components/dashboard-layout';
// import { DollarSign } from 'lucide-react';
// import { getSales, getProducts, getCustomers } from '@/app/actions';
// import { RecordSaleModal } from '@/components/modals/record-sale-modal';

// export default async function SalesPage() {
//   const [sales, products, customers] = await Promise.all([getSales(), getProducts(), getCustomers()]);
//   const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
//   const totalVAT = sales.reduce((sum, s) => sum + s.vatAmount, 0);

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div>
//             <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Sales</h1>
//             <p className="text-muted-foreground text-lg">Record transactions and track revenue in real-time.</p>
//           </div>
//           <RecordSaleModal products={products} customers={customers} />
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-primary/10 text-primary rounded-xl"><DollarSign className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Total Sales</p>
//               <h3 className="text-2xl font-bold text-foreground">{sales.length}</h3>
//             </div>
//           </div>
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-primary/10 text-primary rounded-xl"><DollarSign className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Total Revenue (KES)</p>
//               <h3 className="text-xl font-bold text-foreground">
//                 {totalRevenue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
//               </h3>
//             </div>
//           </div>
//           <div className="card-premium p-6 flex items-center gap-4">
//             <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><DollarSign className="w-6 h-6" /></div>
//             <div>
//               <p className="text-muted-foreground text-sm font-medium">Total VAT Collected (KES)</p>
//               <h3 className="text-xl font-bold text-foreground">
//                 {totalVAT.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
//               </h3>
//             </div>
//           </div>
//         </div>

//         <div className="card-premium overflow-hidden">
//           <div className="p-6 md:p-8">
//             <h2 className="text-2xl font-bold text-foreground mb-6">Sales Ledger</h2>
//             {sales.length === 0 ? (
//               <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
//                 <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-foreground mb-2">No sales recorded yet</h3>
//                 <p className="text-muted-foreground mb-6">Record your first sale to start seeing data here.</p>
//                 <RecordSaleModal products={products} customers={customers} />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b-2 border-border/50 text-muted-foreground">
//                       <th className="pb-3 text-sm font-semibold">Date</th>
//                       <th className="pb-3 text-sm font-semibold">Product</th>
//                       <th className="pb-3 text-sm font-semibold">Customer</th>
//                       <th className="pb-3 text-sm font-semibold text-center">Qty</th>
//                       <th className="pb-3 text-sm font-semibold text-right">VAT (KES)</th>
//                       <th className="pb-3 text-sm font-semibold text-right">Total (KES)</th>
//                       <th className="pb-3 text-sm font-semibold text-center">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sales.map((sale) => (
//                       <tr key={sale.id} className="border-b border-border hover:bg-muted/30 transition-colors">
//                         <td className="py-4 text-sm text-muted-foreground">
//                           {new Date(sale.saleDate).toLocaleDateString('en-KE')}
//                         </td>
//                         <td className="py-4 font-semibold text-foreground">{sale.product.name}</td>
//                         <td className="py-4 text-muted-foreground text-sm">{sale.customer?.name ?? 'Walk-in'}</td>
//                         <td className="py-4 text-foreground text-center">{sale.quantity}</td>
//                         <td className="py-4 font-mono text-muted-foreground text-right">
//                           {sale.vatAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
//                         </td>
//                         <td className="py-4 font-mono font-bold text-primary text-right">
//                           {sale.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
//                         </td>
//                         <td className="py-4 text-center">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             sale.status === 'PAID' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
//                           }`}>
//                             {sale.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign } from 'lucide-react';
import { getSales, getProducts, getCustomers } from '@/app/actions';
import { RecordSaleModal } from '@/components/modals/record-sale-modal';

export default async function SalesPage() {
  const [sales, products, customers] = await Promise.all([
    getSales(),
    getProducts(),
    getCustomers(),
  ]);

  const totalRevenue = sales.reduce((sum: number, s: { totalAmount: number; }) => sum + s.totalAmount, 0);
  const totalVAT = sales.reduce((sum: number, s: { vatAmount: number; }) => sum + s.vatAmount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Sales</h1>
            <p className="text-muted-foreground text-lg">Record transactions and track revenue in real-time.</p>
          </div>
          <RecordSaleModal products={products} customers={customers} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Sales</p>
              <h3 className="text-2xl font-bold text-foreground">{sales.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Revenue (KES)</p>
              <h3 className="text-xl font-bold text-foreground">
                {totalRevenue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total VAT Collected (KES)</p>
              <h3 className="text-xl font-bold text-foreground">
                {totalVAT.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="card-premium overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Sales Ledger</h2>
            {sales.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No sales recorded yet</h3>
                <p className="text-muted-foreground mb-6">Record your first sale to start seeing data here.</p>
                <RecordSaleModal products={products} customers={customers} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Date</th>
                      <th className="pb-3 text-sm font-semibold">Product</th>
                      <th className="pb-3 text-sm font-semibold">Customer</th>
                      <th className="pb-3 text-sm font-semibold text-center">Qty</th>
                      <th className="pb-3 text-sm font-semibold text-right">VAT (KES)</th>
                      <th className="pb-3 text-sm font-semibold text-right">Total (KES)</th>
                      <th className="pb-3 text-sm font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale: any) => (
                      <tr
                        key={sale.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(sale.saleDate).toLocaleDateString('en-KE')}
                        </td>
                        <td className="py-4 font-semibold text-foreground">{sale.product.name}</td>
                        <td className="py-4 text-muted-foreground text-sm">
                          {sale.customer?.name ?? 'Walk-in'}
                        </td>
                        <td className="py-4 text-foreground text-center">{sale.quantity}</td>
                        <td className="py-4 font-mono text-muted-foreground text-right">
                          {sale.vatAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 font-mono font-bold text-primary text-right">
                          {sale.totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${sale.status === 'PAID'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-destructive/10 text-destructive'
                              }`}
                          >
                            {sale.status}
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
      </div>
    </DashboardLayout>
  );
}