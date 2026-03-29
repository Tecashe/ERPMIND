import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, Wallet, BadgeCheck } from 'lucide-react';
import { getEmployees, getPayrollHistory } from '@/app/actions';
import { AddEmployeeModal } from '@/components/modals/add-employee-modal';

export default async function HRPage() {
  const [employees, payroll] = await Promise.all([getEmployees(), getPayrollHistory()]);
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Human Resources</h1>
            <p className="text-muted-foreground text-lg">Manage employees and payroll.</p>
          </div>
          <AddEmployeeModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Employees</p>
              <h3 className="text-2xl font-bold text-foreground">{employees.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><BadgeCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Active</p>
              <h3 className="text-2xl font-bold text-foreground">{employees.filter(e => e.isActive).length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-xl"><Wallet className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Monthly Payroll</p>
              <h3 className="text-xl font-bold text-foreground">
                KES {totalPayroll.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="card-premium overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Staff Directory</h2>
            {employees.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employees found. Add your first employee to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Name</th>
                      <th className="pb-3 text-sm font-semibold">Email</th>
                      <th className="pb-3 text-sm font-semibold">Department</th>
                      <th className="pb-3 text-sm font-semibold">Role</th>
                      <th className="pb-3 text-sm font-semibold text-right">Salary (KES)</th>
                      <th className="pb-3 text-sm font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e) => (
                      <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-semibold text-foreground">{e.name}</td>
                        <td className="py-4 text-muted-foreground text-sm">{e.email}</td>
                        <td className="py-4 text-foreground">{e.department}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">{e.role}</span>
                        </td>
                        <td className="py-4 font-mono font-bold text-foreground text-right">
                          {e.salary.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
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

        {/* Payroll History */}
        {payroll.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Payroll History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border/50 text-muted-foreground">
                      <th className="pb-3 text-sm font-semibold">Employee</th>
                      <th className="pb-3 text-sm font-semibold">Period</th>
                      <th className="pb-3 text-sm font-semibold">Paid At</th>
                      <th className="pb-3 text-sm font-semibold text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.map((p) => (
                      <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-semibold text-foreground">{p.employee.name}</td>
                        <td className="py-4 text-foreground">{p.period}</td>
                        <td className="py-4 text-muted-foreground text-sm">{new Date(p.paidAt).toLocaleDateString('en-KE')}</td>
                        <td className="py-4 font-mono font-bold text-destructive text-right">
                          -{p.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
