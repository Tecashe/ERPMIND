import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { DollarSign, Calendar, Receipt } from 'lucide-react';
import { getPayrollHistory, getEmployees } from '@/app/actions';

export default async function PayrollPage() {
  const [payrolls, employees] = await Promise.all([
    getPayrollHistory(),
    getEmployees(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const totalDisbursed = payrolls.reduce((s, p) => s + p.amount, 0);
  const activeMonthlyPayroll = employees.filter((e) => e.isActive).reduce((s, e) => s + e.salary, 0);

  // Group by period
  const byPeriod = payrolls.reduce<Record<string, { amount: number; count: number }>>((acc, p) => {
    if (!acc[p.period]) acc[p.period] = { amount: 0, count: 0 };
    acc[p.period].amount += p.amount;
    acc[p.period].count += 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Payroll</h1>
          <p className="text-muted-foreground">All payroll disbursements — every run creates an expense entry in Finance automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Disbursed</p>
              <h3 className="text-xl font-bold text-destructive">{fmt(totalDisbursed)}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Calendar className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Periods Run</p>
              <h3 className="text-2xl font-bold text-foreground">{Object.keys(byPeriod).length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Monthly Payroll</p>
              <h3 className="text-xl font-bold text-foreground">{fmt(activeMonthlyPayroll)}</h3>
            </div>
          </div>
        </div>

        {/* Payroll by Period Summary */}
        {Object.keys(byPeriod).length > 0 && (
          <div className="card-premium overflow-hidden mb-6">
            <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Payroll by Period</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Period</th>
                    <th className="py-3 px-6 font-semibold text-center">Employees Paid</th>
                    <th className="py-3 px-6 font-semibold text-right">Total Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byPeriod).map(([period, data]) => (
                    <tr key={period} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{period}</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">{data.count}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-destructive">{fmt(data.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Per Employee View */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">All Payroll Entries</h2></div>
          {payrolls.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payroll processed yet. Run payroll from the HR dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Employee</th>
                    <th className="py-3 px-6 font-semibold">Period</th>
                    <th className="py-3 px-6 font-semibold text-right">Amount (KES)</th>
                    <th className="py-3 px-6 font-semibold">Paid On</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{p.employee.name}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-medium">{p.period}</span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-foreground">
                        {p.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(p.paidAt).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
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
