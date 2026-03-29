// import React from 'react';
// import { DashboardLayout } from '@/components/dashboard-layout';
// import { FileText, TrendingUp, Users, Package, DollarSign, Scale, ShoppingBag } from 'lucide-react';
// import { getDashboardMetrics, getFinanceSummary, getSales, getEmployees } from '@/app/actions';

// export default async function ReportsPage() {
//   const [metrics, finance, sales, employees] = await Promise.all([
//     getDashboardMetrics(),
//     getFinanceSummary(),
//     getSales(),
//     getEmployees(),
//   ]);

//   const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
//   const totalPayroll = employees.reduce((sum: number, e: { salary: number }) => sum + e.salary, 0);

//   // Sales by product aggregation
//   const salesByProduct = sales.reduce<Record<string, { name: string; qty: number; total: number }>>((acc, s) => {
//     if (!acc[s.productId]) acc[s.productId] = { name: s.product.name, qty: 0, total: 0 };
//     acc[s.productId].qty += s.quantity;
//     acc[s.productId].total += s.totalAmount;
//     return acc;
//   }, {});

//   const topProducts = Object.values(salesByProduct)
//     .sort((a, b) => b.total - a.total)
//     .slice(0, 5);

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-3">Reports</h1>
//           <p className="text-muted-foreground text-lg">Live business intelligence across all modules.</p>
//         </div>

//         {/* P&L Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="card-premium p-8">
//             <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4"><TrendingUp className="w-6 h-6" /></div>
//             <p className="text-muted-foreground font-medium mb-1">Total Income</p>
//             <h3 className="text-2xl font-bold text-primary">{fmt(finance.totalIncome)}</h3>
//           </div>
//           <div className="card-premium p-8">
//             <div className="p-3 bg-destructive/10 text-destructive rounded-xl w-fit mb-4"><DollarSign className="w-6 h-6" /></div>
//             <p className="text-muted-foreground font-medium mb-1">Total Expenses</p>
//             <h3 className="text-2xl font-bold text-destructive">{fmt(finance.totalExpenses)}</h3>
//           </div>
//           <div className="card-premium p-8">
//             <div className={`p-3 rounded-xl w-fit mb-4 ${finance.netBalance >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
//               <Scale className="w-6 h-6" />
//             </div>
//             <p className="text-muted-foreground font-medium mb-1">Net Profit / Loss</p>
//             <h3 className={`text-2xl font-bold ${finance.netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
//               {finance.netBalance < 0 ? '-' : ''}{fmt(Math.abs(finance.netBalance))}
//             </h3>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//           {/* Top Products by Revenue */}
//           <div className="card-premium p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-primary/10 text-primary rounded-lg"><TrendingUp className="w-5 h-5" /></div>
//               <h2 className="text-xl font-bold text-foreground">Top Products by Revenue</h2>
//             </div>
//             {topProducts.length === 0 ? (
//               <p className="text-muted-foreground text-center py-8">No sales recorded yet.</p>
//             ) : (
//               <div className="space-y-4">
//                 {topProducts.map((p, i) => {
//                   const pct = finance.totalIncome > 0 ? (p.total / finance.totalIncome) * 100 : 0;
//                   return (
//                     <div key={p.name}>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-semibold text-foreground">#{i + 1} {p.name}</span>
//                         <span className="text-sm font-mono text-foreground">{fmt(p.total)}</span>
//                       </div>
//                       <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
//                         <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
//                       </div>
//                       <p className="text-xs text-muted-foreground mt-1">{p.qty} units sold · {pct.toFixed(1)}% of revenue</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Payroll Summary */}
//           <div className="card-premium p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-2 bg-primary/10 text-primary rounded-lg"><Users className="w-5 h-5" /></div>
//               <h2 className="text-xl font-bold text-foreground">HR & Payroll Overview</h2>
//             </div>
//             <div className="space-y-4">
//               <div className="flex justify-between py-3 border-b border-border">
//                 <span className="text-muted-foreground">Active Employees</span>
//                 <span className="font-bold text-foreground">{employees.filter(e => e.isActive).length}</span>
//               </div>
//               <div className="flex justify-between py-3 border-b border-border">
//                 <span className="text-muted-foreground">Monthly Payroll</span>
//                 <span className="font-bold text-foreground">{fmt(totalPayroll)}</span>
//               </div>
//               <div className="flex justify-between py-3 border-b border-border">
//                 <span className="text-muted-foreground">Avg. Salary</span>
//                 <span className="font-bold text-foreground">
//                   {employees.length > 0 ? fmt(totalPayroll / employees.length) : 'N/A'}
//                 </span>
//               </div>
//               <div className="flex justify-between py-3">
//                 <span className="text-muted-foreground">Payroll as % of Revenue</span>
//                 <span className="font-bold text-foreground">
//                   {finance.totalIncome > 0 ? `${((totalPayroll / finance.totalIncome) * 100).toFixed(1)}%` : 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Business KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { label: 'Total Transactions', value: String(metrics.sales), icon: ShoppingBag, color: 'primary' },
//             { label: 'Products in Inventory', value: String(metrics.products), icon: Package, color: 'secondary' },
//             { label: 'Total Employees', value: String(metrics.employees), icon: Users, color: 'primary' },
//             { label: 'Pending Sales', value: String(metrics.pendingSales), icon: FileText, color: metrics.pendingSales > 0 ? 'destructive' : 'primary' },
//           ].map(({ label, value, icon: Icon, color }) => (
//             <div key={label} className="card-premium p-6 flex items-center gap-4">
//               <div className={`p-3 bg-${color}/10 text-${color} rounded-xl`}><Icon className="w-6 h-6" /></div>
//               <div>
//                 <p className="text-muted-foreground text-sm font-medium">{label}</p>
//                 <h3 className="text-2xl font-bold text-foreground">{value}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }


import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { FileText, TrendingUp, Users, Package, DollarSign, Scale, ShoppingBag } from 'lucide-react';
import { getDashboardMetrics, getFinanceSummary, getSales, getEmployees } from '@/app/actions';

type ProductAgg = { name: string; qty: number; total: number };

type KpiColor = 'primary' | 'secondary' | 'destructive';

type KpiCard = {
  label: string;
  value: string;
  icon: React.ElementType;
  color: KpiColor;
};

export default async function ReportsPage() {
  const [metrics, finance, sales, employees] = await Promise.all([
    getDashboardMetrics(),
    getFinanceSummary(),
    getSales(),
    getEmployees(),
  ]);

  const fmt = (n: number) =>
    `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const totalPayroll = employees.reduce(
    (sum: number, e: { salary: number }) => sum + e.salary,
    0
  );

  // Replace these two lines:
  const salesByProduct = sales.reduce<Record<string, ProductAgg>>((acc: Record<string, ProductAgg>, s: { productId: string; product: { name: string }; quantity: number; totalAmount: number }) => {
    if (!acc[s.productId]) {
      acc[s.productId] = { name: s.product.name, qty: 0, total: 0 };
    }
    acc[s.productId].qty += s.quantity;
    acc[s.productId].total += s.totalAmount;
    return acc;
  }, {});

  const topProducts: ProductAgg[] = (Object.values(salesByProduct) as ProductAgg[])
    .sort((a: ProductAgg, b: ProductAgg) => b.total - a.total)
    .slice(0, 5);

  const kpiCards: KpiCard[] = [
    { label: 'Total Transactions', value: String(metrics.sales), icon: ShoppingBag, color: 'primary' },
    { label: 'Products in Inventory', value: String(metrics.products), icon: Package, color: 'secondary' },
    { label: 'Total Employees', value: String(metrics.employees), icon: Users, color: 'primary' },
    {
      label: 'Pending Sales',
      value: String(metrics.pendingSales),
      icon: FileText,
      color: metrics.pendingSales > 0 ? 'destructive' : 'primary',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-3">Reports</h1>
          <p className="text-muted-foreground text-lg">Live business intelligence across all modules.</p>
        </div>

        {/* P&L Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-8">
            <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-primary">{fmt(finance.totalIncome)}</h3>
          </div>
          <div className="card-premium p-8">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl w-fit mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-destructive">{fmt(finance.totalExpenses)}</h3>
          </div>
          <div className="card-premium p-8">
            <div
              className={`p-3 rounded-xl w-fit mb-4 ${finance.netBalance >= 0
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
                }`}
            >
              <Scale className="w-6 h-6" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">Net Profit / Loss</p>
            <h3
              className={`text-2xl font-bold ${finance.netBalance >= 0 ? 'text-primary' : 'text-destructive'
                }`}
            >
              {finance.netBalance < 0 ? '-' : ''}
              {fmt(Math.abs(finance.netBalance))}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Top Products by Revenue */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Top Products by Revenue</h2>
            </div>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sales recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((p: ProductAgg, i: number) => {
                  const pct =
                    finance.totalIncome > 0 ? (p.total / finance.totalIncome) * 100 : 0;
                  return (
                    <div key={p.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          #{i + 1} {p.name}
                        </span>
                        <span className="text-sm font-mono text-foreground">{fmt(p.total)}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.qty} units sold · {pct.toFixed(1)}% of revenue
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payroll Summary */}
          <div className="card-premium p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">HR & Payroll Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Active Employees</span>
                <span className="font-bold text-foreground">
                  {employees.filter((e: { isActive: boolean }) => e.isActive).length}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Monthly Payroll</span>
                <span className="font-bold text-foreground">{fmt(totalPayroll)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Avg. Salary</span>
                <span className="font-bold text-foreground">
                  {employees.length > 0 ? fmt(totalPayroll / employees.length) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Payroll as % of Revenue</span>
                <span className="font-bold text-foreground">
                  {finance.totalIncome > 0
                    ? `${((totalPayroll / finance.totalIncome) * 100).toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Business KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map(({ label, value, icon: Icon, color }: KpiCard) => (
            <div key={label} className="card-premium p-6 flex items-center gap-4">
              <div className={`p-3 bg-${color}/10 text-${color} rounded-xl`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}