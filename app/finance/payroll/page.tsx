import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, TrendingDown, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { getEmployees } from '@/app/actions';
import { getPayrollHistory } from '@/app/actions/accounting';
import { computeKenyaPayroll } from '@/lib/kenya-tax';
import { RunPayrollButton } from '@/components/accounting/run-payroll-button';

const fmt = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 2 });

export default async function PayrollPage() {
  const [employees, payrollHistory] = await Promise.all([
    getEmployees(),
    getPayrollHistory(),
  ]);

  const activeEmployees = employees.filter((e) => e.isActive);

  // Compute current month's statutory deductions for all active employees
  const payrollPreview = activeEmployees.map((emp) => {
    const calc = computeKenyaPayroll({ grossSalary: emp.salary });
    return { ...emp, calc };
  });

  const totalGross = payrollPreview.reduce((s, e) => s + e.salary, 0);
  const totalPAYE = payrollPreview.reduce((s, e) => s + e.calc.netPaye, 0);
  const totalNSSF = payrollPreview.reduce((s, e) => s + e.calc.nssfEmployee, 0);
  const totalSHIF = payrollPreview.reduce((s, e) => s + e.calc.shif, 0);
  const totalAHL = payrollPreview.reduce((s, e) => s + e.calc.ahl, 0);
  const totalNet = payrollPreview.reduce((s, e) => s + e.calc.netPay, 0);
  const totalEmployerCost = payrollPreview.reduce((s, e) => s + e.calc.totalEmployerCost, 0);

  const currentPeriod = new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">Payroll</h1>
                <p className="text-muted-foreground">Kenya statutory payroll — PAYE · NSSF · SHIF · AHL</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{currentPeriod}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Gross Payroll', value: totalGross, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Total PAYE', value: totalPAYE, icon: TrendingDown, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Net Pay (Take-home)', value: totalNet, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Employer Total Cost', value: totalEmployerCost, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          ].map((card) => (
            <div key={card.label} className="card-premium p-5">
              <div className={`p-2 rounded-lg ${card.bg} w-fit mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>KES {fmt(typeof card.value === 'number' ? card.value : 0)}</p>
            </div>
          ))}
        </div>

        {/* Statutory Summary */}
        <div className="card-premium p-6 mb-8">
          <h2 className="font-bold text-foreground mb-4">Statutory Remittances This Payroll Run</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { label: 'PAYE', amount: totalPAYE, due: '9th' },
              { label: 'NSSF (Employee)', amount: totalNSSF, due: '9th' },
              { label: 'NSSF (Employer)', amount: payrollPreview.reduce((s, e) => s + e.calc.nssfEmployer, 0), due: '9th' },
              { label: 'SHIF (2.75%)', amount: totalSHIF, due: '9th' },
              { label: 'AHL (1.5% each)', amount: totalAHL * 2, due: '9th' },
            ].map((item) => (
              <div key={item.label} className="bg-muted/30 rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-bold text-lg text-foreground">KES {fmt(item.amount)}</p>
                <p className="text-xs text-muted-foreground mt-1">Due {item.due}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Payroll Preview */}
        <div className="card-premium overflow-hidden mb-8">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Employee Payslip Preview — {currentPeriod}</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground">
                  <th className="text-left px-5 py-3 font-semibold">Employee</th>
                  <th className="text-left px-5 py-3 font-semibold">Department</th>
                  <th className="text-right px-5 py-3 font-semibold">Gross</th>
                  <th className="text-right px-5 py-3 font-semibold">SHIF</th>
                  <th className="text-right px-5 py-3 font-semibold">AHL</th>
                  <th className="text-right px-5 py-3 font-semibold">NSSF</th>
                  <th className="text-right px-5 py-3 font-semibold">PAYE</th>
                  <th className="text-right px-5 py-3 font-semibold text-emerald-600">Net Pay</th>
                  <th className="text-center px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrollPreview.map((emp) => {
                  const alreadyPaid = payrollHistory.some(
                    (p) => p.employeeId === emp.id && p.period === currentPeriod
                  );
                  return (
                    <tr key={emp.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{emp.department}</td>
                      <td className="px-5 py-3.5 text-right font-mono">{fmt(emp.salary)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-teal-600">{fmt(emp.calc.shif)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-indigo-600">{fmt(emp.calc.ahl)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-blue-600">{fmt(emp.calc.nssfEmployee)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-purple-600">{fmt(emp.calc.netPaye)}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">{fmt(emp.calc.netPay)}</td>
                      <td className="px-5 py-3.5 text-center">
                        {alreadyPaid ? (
                          <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">Paid ✓</span>
                        ) : (
                          <RunPayrollButton employeeId={emp.id} period={currentPeriod} employeeName={emp.name} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/20 font-bold text-sm">
                  <td className="px-5 py-3" colSpan={2}>TOTALS</td>
                  <td className="px-5 py-3 text-right font-mono">{fmt(totalGross)}</td>
                  <td className="px-5 py-3 text-right font-mono text-teal-600">{fmt(totalSHIF)}</td>
                  <td className="px-5 py-3 text-right font-mono text-indigo-600">{fmt(totalAHL)}</td>
                  <td className="px-5 py-3 text-right font-mono text-blue-600">{fmt(totalNSSF)}</td>
                  <td className="px-5 py-3 text-right font-mono text-purple-600">{fmt(totalPAYE)}</td>
                  <td className="px-5 py-3 text-right font-mono text-emerald-600">{fmt(totalNet)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payroll History */}
        {payrollHistory.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-bold text-foreground">Payroll History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    <th className="text-left px-5 py-3 font-semibold">Employee</th>
                    <th className="text-left px-5 py-3 font-semibold">Period</th>
                    <th className="text-right px-5 py-3 font-semibold">Gross</th>
                    <th className="text-right px-5 py-3 font-semibold">PAYE</th>
                    <th className="text-right px-5 py-3 font-semibold">NSSF</th>
                    <th className="text-right px-5 py-3 font-semibold">SHIF</th>
                    <th className="text-right px-5 py-3 font-semibold">Net Pay</th>
                    <th className="text-left px-5 py-3 font-semibold">Paid On</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollHistory.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/20">
                      <td className="px-5 py-3.5 font-semibold text-foreground">{p.employee.name}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{p.period}</td>
                      <td className="px-5 py-3.5 text-right font-mono">{fmt(p.amount)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-purple-600">{fmt(p.deduction?.paye ?? 0)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-blue-600">{fmt(p.deduction?.nssfEmployee ?? 0)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-teal-600">{fmt(p.deduction?.shiF ?? 0)}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">{fmt(p.deduction?.netPay ?? p.amount)}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{new Date(p.paidAt).toLocaleDateString('en-KE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
