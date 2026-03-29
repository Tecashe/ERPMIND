import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, DollarSign, BarChart3 } from 'lucide-react';
import { getEmployees, getPayrollHistory } from '@/app/actions';

export default async function HrAnalyticsPage() {
  const [employees, payrolls] = await Promise.all([
    getEmployees(),
    getPayrollHistory(),
  ]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const activeEmps = employees.filter((e) => e.isActive);
  const totalMonthly = activeEmps.reduce((s, e) => s + e.salary, 0);
  const totalDisbursed = payrolls.reduce((s, p) => s + p.amount, 0);

  // By department
  const byDept = employees.reduce<Record<string, { count: number; payroll: number }>>((acc, e) => {
    if (!acc[e.department]) acc[e.department] = { count: 0, payroll: 0 };
    acc[e.department].count += 1;
    if (e.isActive) acc[e.department].payroll += e.salary;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">HR Analytics</h1>
          <p className="text-muted-foreground">Workforce insights — headcount, payroll cost, and departmental breakdown.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary" /><p className="text-sm text-muted-foreground">Active Staff</p></div>
            <h3 className="text-2xl font-bold text-foreground">{activeEmps.length}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-destructive" /><p className="text-sm text-muted-foreground">Monthly Payroll</p></div>
            <h3 className="text-lg font-bold text-destructive">{fmt(totalMonthly)}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-foreground" /><p className="text-sm text-muted-foreground">Total Disbursed</p></div>
            <h3 className="text-lg font-bold text-foreground">{fmt(totalDisbursed)}</h3>
          </div>
          <div className="card-premium p-6">
            <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">Departments</p></div>
            <h3 className="text-2xl font-bold text-foreground">{Object.keys(byDept).length}</h3>
          </div>
        </div>

        {/* By Department */}
        <div className="card-premium overflow-hidden mb-6">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Cost by Department</h2></div>
          {Object.keys(byDept).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No employee data</div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(byDept).map(([dept, data]) => {
                const pct = totalMonthly > 0 ? (data.payroll / totalMonthly) * 100 : 0;
                return (
                  <div key={dept} className="p-5">
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <span className="font-semibold text-foreground">{dept}</span>
                        <span className="text-xs text-muted-foreground ml-2">{data.count} staff</span>
                      </div>
                      <span className="font-mono text-destructive font-bold text-sm">{fmt(data.payroll)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% of total payroll</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Employee salary table */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border"><h2 className="text-xl font-bold text-foreground">Employee Salary Table</h2></div>
          {employees.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No employees found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Name</th>
                    <th className="py-3 px-6 font-semibold">Department</th>
                    <th className="py-3 px-6 font-semibold">Role</th>
                    <th className="py-3 px-6 font-semibold text-right">Salary (KES)</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.sort((a, b) => b.salary - a.salary).map((e) => (
                    <tr key={e.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{e.name}</td>
                      <td className="py-4 px-6 text-muted-foreground">{e.department}</td>
                      <td className="py-4 px-6 text-muted-foreground">{e.role}</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-foreground">{e.salary.toLocaleString('en-KE')}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${e.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {e.isActive ? 'Active' : 'Inactive'}
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
    </DashboardLayout>
  );
}
