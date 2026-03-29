import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, Mail, Briefcase, DollarSign } from 'lucide-react';
import { getEmployees } from '@/app/actions';

export default async function EmployeeRecordsPage() {
  const employees = await getEmployees();

  const activeCount = employees.filter((e) => e.isActive).length;
  const totalPayroll = employees.filter((e) => e.isActive).reduce((s, e) => s + e.salary, 0);

  const departmentGroups = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.department] = (acc[e.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Employee Records</h1>
          <p className="text-muted-foreground">Full staff directory — each employee feeds into Payroll and Finance automatically.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Employees</p>
              <h3 className="text-2xl font-bold text-foreground">{activeCount}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Briefcase className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Departments</p>
              <h3 className="text-2xl font-bold text-foreground">{Object.keys(departmentGroups).length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Monthly Payroll</p>
              <h3 className="text-xl font-bold text-primary">KES {totalPayroll.toLocaleString('en-KE')}</h3>
            </div>
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="card-premium py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No employees on record</h3>
            <p className="text-muted-foreground">Add employee records from the HR dashboard to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <div key={emp.id} className="card-premium p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{emp.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    emp.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">{emp.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">{emp.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary (KES)</span>
                    <span className="font-mono font-bold text-foreground">{emp.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hired</span>
                    <span className="text-muted-foreground">{new Date(emp.hiredAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
