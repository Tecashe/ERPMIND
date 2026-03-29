import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.join(__dirname, '..', 'app');

const genericTemplate = (title, moduleName) => {
  const compName = title.replace(/\s+/g, '');
  return 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { Construction } from "lucide-react";\n\n' +
'export default function ' + compName + 'Page() {\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">' + title + '</h1>\n' +
'          <p className="text-muted-foreground">' + moduleName + ' Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="card-premium p-12 text-center border border-dashed border-border">\n' +
'          <Construction className="w-16 h-16 text-muted-foreground mx-auto mb-4" />\n' +
'          <h2 className="text-2xl font-bold text-foreground mb-2">Module Coming Soon</h2>\n' +
'          <p className="text-muted-foreground max-w-md mx-auto">\n' +
'            This module is currently being provisioned. Features for ' + title + ' will be available in the upcoming database schema expansion.\n' +
'          </p>\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';
};

const financeLedgerTemplate = 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { DollarSign, FileText } from "lucide-react";\n' +
'import { getFinancialRecords } from "@/app/actions";\n\n' +
'export default async function GeneralLedgerPage() {\n' +
'  const records = await getFinancialRecords();\n\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">General Ledger</h1>\n' +
'          <p className="text-muted-foreground">Finance & Accounting Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="card-premium overflow-hidden">\n' +
'          <div className="p-6">\n' +
'            <h2 className="text-xl font-bold text-foreground mb-4">Financial Transactions</h2>\n' +
'            {records.length === 0 ? (\n' +
'              <div className="py-12 text-center">\n' +
'                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />\n' +
'                <h3 className="text-xl font-semibold mb-2">No records found</h3>\n' +
'              </div>\n' +
'            ) : (\n' +
'              <div className="overflow-x-auto">\n' +
'                <table className="w-full text-left">\n' +
'                  <thead>\n' +
'                    <tr className="border-b-2 border-border/50 text-muted-foreground">\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Date</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Description</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Category</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm text-right">Amount (KES)</th>\n' +
'                    </tr>\n' +
'                  </thead>\n' +
'                  <tbody>\n' +
'                    {records.map((r) => (\n' +
'                      <tr key={r.id} className="border-b border-border hover:bg-muted/30">\n' +
'                        <td className="py-4 px-4 text-sm text-muted-foreground">\n' +
'                          {new Date(r.date).toLocaleDateString("en-KE")}\n' +
'                        </td>\n' +
'                        <td className="py-4 px-4 font-medium">{r.description}</td>\n' +
'                        <td className="py-4 px-4">\n' +
'                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">\n' +
'                            {r.category}\n' +
'                          </span>\n' +
'                        </td>\n' +
'                        <td className={"py-4 px-4 text-right font-bold " + (r.type === "INCOME" ? "text-primary" : "text-destructive")}>\n' +
'                          {r.type === "INCOME" ? "+" : "-"} {r.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}\n' +
'                        </td>\n' +
'                      </tr>\n' +
'                    ))}\n' +
'                  </tbody>\n' +
'                </table>\n' +
'              </div>\n' +
'            )}\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';

const HrEmployeesTemplate = 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { Users } from "lucide-react";\n' +
'import { getEmployees } from "@/app/actions";\n\n' +
'export default async function EmployeeRecordsPage() {\n' +
'  const employees = await getEmployees();\n\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Records</h1>\n' +
'          <p className="text-muted-foreground">Human Resources Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n' +
'          {employees.map(emp => (\n' +
'            <div key={emp.id} className="card-premium p-6">\n' +
'              <div className="flex items-center gap-4 mb-4">\n' +
'                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">\n' +
'                  {emp.name.charAt(0)}\n' +
'                </div>\n' +
'                <div>\n' +
'                  <h3 className="font-bold text-lg">{emp.name}</h3>\n' +
'                  <p className="text-sm text-muted-foreground">{emp.email}</p>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div className="space-y-2 text-sm">\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Role</span>\n' +
'                  <span className="font-medium">{emp.role}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Department</span>\n' +
'                  <span className="font-medium">{emp.department}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Salary (KES)</span>\n' +
'                  <span className="font-mono">{emp.salary.toLocaleString()}</span>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'          ))}\n' +
'          {employees.length === 0 && (\n' +
'            <div className="col-span-full text-center py-12 card-premium">\n' +
'              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />\n' +
'              <h3 className="text-xl font-bold text-foreground">No Employees</h3>\n' +
'              <p className="text-muted-foreground">Create your first employee record to see them here.</p>\n' +
'            </div>\n' +
'          )}\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';

const HrPayrollTemplate = 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { DollarSign, Receipt } from "lucide-react";\n' +
'import { getPayrollHistory } from "@/app/actions";\n\n' +
'export default async function PayrollPage() {\n' +
'  const payrolls = await getPayrollHistory();\n\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">Payroll History</h1>\n' +
'          <p className="text-muted-foreground">Human Resources Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="card-premium overflow-hidden">\n' +
'          <div className="p-6">\n' +
'            <h2 className="text-xl font-bold text-foreground mb-4">Past Disbursements</h2>\n' +
'            {payrolls.length === 0 ? (\n' +
'              <div className="py-12 text-center border-dashed border-2 border-border rounded-xl">\n' +
'                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />\n' +
'                <h3 className="text-xl font-semibold mb-2">No payroll records</h3>\n' +
'              </div>\n' +
'            ) : (\n' +
'              <div className="overflow-x-auto">\n' +
'                <table className="w-full text-left">\n' +
'                  <thead>\n' +
'                    <tr className="border-b-2 border-border/50 text-muted-foreground">\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Employee</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Period</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm text-right">Amount (KES)</th>\n' +
'                      <th className="pb-3 px-4 font-semibold text-sm">Paid Date</th>\n' +
'                    </tr>\n' +
'                  </thead>\n' +
'                  <tbody>\n' +
'                    {payrolls.map((p) => (\n' +
'                      <tr key={p.id} className="border-b border-border hover:bg-muted/30">\n' +
'                        <td className="py-4 px-4 font-medium">{p.employee.name}</td>\n' +
'                        <td className="py-4 px-4">\n' +
'                          <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">\n' +
'                            {p.period}\n' +
'                          </span>\n' +
'                        </td>\n' +
'                        <td className="py-4 px-4 text-right font-mono font-bold text-foreground">\n' +
'                          {p.amount.toLocaleString("en-KE")}\n' +
'                        </td>\n' +
'                        <td className="py-4 px-4 text-sm text-muted-foreground">\n' +
'                          {new Date(p.paidAt).toLocaleDateString("en-KE")}\n' +
'                        </td>\n' +
'                      </tr>\n' +
'                    ))}\n' +
'                  </tbody>\n' +
'                </table>\n' +
'              </div>\n' +
'            )}\n' +
'          </div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';

const ProcurementSuppliersTemplate = 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { Truck } from "lucide-react";\n' +
'import { getSuppliers } from "@/app/actions";\n\n' +
'export default async function SuppliersPage() {\n' +
'  const suppliers = await getSuppliers();\n\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">Supplier Management</h1>\n' +
'          <p className="text-muted-foreground">Procurement Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n' +
'          {suppliers.map(sup => (\n' +
'            <div key={sup.id} className="card-premium p-6">\n' +
'              <div className="flex items-center gap-3 mb-4">\n' +
'                <div className="p-3 bg-secondary/10 text-secondary rounded-xl">\n' +
'                  <Truck className="w-5 h-5" />\n' +
'                </div>\n' +
'                <h3 className="font-bold text-lg">{sup.name}</h3>\n' +
'              </div>\n' +
'              <div className="space-y-2 text-sm">\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Email</span>\n' +
'                  <span className="font-medium text-right break-all">{sup.email || "N/A"}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Phone</span>\n' +
'                  <span className="font-medium text-right">{sup.phone || "N/A"}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Address</span>\n' +
'                  <span className="font-medium text-right max-w-[150px] truncate">{sup.address || "N/A"}</span>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'          ))}\n' +
'          {suppliers.length === 0 && (\n' +
'            <div className="col-span-full text-center py-12 card-premium">\n' +
'              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />\n' +
'              <h3 className="text-xl font-bold text-foreground">No Suppliers</h3>\n' +
'              <p className="text-muted-foreground">Add suppliers to track purchase orders.</p>\n' +
'            </div>\n' +
'          )}\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';

const CrmCustomersTemplate = 'import React from "react";\n' +
'import { DashboardLayout } from "@/components/dashboard-layout";\n' +
'import { Users } from "lucide-react";\n' +
'import { getCustomers } from "@/app/actions";\n\n' +
'export default async function CrmCustomersPage() {\n' +
'  const customers = await getCustomers();\n\n' +
'  return (\n' +
'    <DashboardLayout>\n' +
'      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">\n' +
'        <div className="mb-8">\n' +
'          <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>\n' +
'          <p className="text-muted-foreground">CRM Module Workspace</p>\n' +
'        </div>\n' +
'        \n' +
'        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n' +
'          {customers.map(c => (\n' +
'            <div key={c.id} className="card-premium p-6">\n' +
'              <div className="flex items-center gap-3 mb-4">\n' +
'                <div className="p-3 bg-primary/10 text-primary rounded-xl">\n' +
'                  <Users className="w-5 h-5" />\n' +
'                </div>\n' +
'                <div>\n' +
'                   <h3 className="font-bold text-lg">{c.name}</h3>\n' +
'                   <span className="text-xs text-muted-foreground block">{c.company || "Individual"}</span>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div className="space-y-2 text-sm pt-4 border-t border-border">\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Email</span>\n' +
'                  <span className="font-medium text-right">{c.email || "N/A"}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Phone</span>\n' +
'                  <span className="font-medium text-right">{c.phone || "N/A"}</span>\n' +
'                </div>\n' +
'                <div className="flex justify-between">\n' +
'                  <span className="text-muted-foreground">Total Sales</span>\n' +
'                  <span className="font-bold text-primary">{c._count.sales} orders</span>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'          ))}\n' +
'          {customers.length === 0 && (\n' +
'            <div className="col-span-full text-center py-12 card-premium">\n' +
'              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />\n' +
'              <h3 className="text-xl font-bold text-foreground">No Customers</h3>\n' +
'              <p className="text-muted-foreground">Create customers in Sales or CRM to see them here.</p>\n' +
'            </div>\n' +
'          )}\n' +
'        </div>\n' +
'      </div>\n' +
'    </DashboardLayout>\n' +
'  );\n' +
'}\n';

const routes = [
  { path: '/finance/ledger', title: 'General Ledger', moduleName: 'Finance', content: financeLedgerTemplate },
  { path: '/finance/payable', title: 'Accounts Payable', moduleName: 'Finance', content: null },
  { path: '/finance/receivable', title: 'Accounts Receivable', moduleName: 'Finance', content: null },
  { path: '/finance/banking', title: 'Bank Reconciliation', moduleName: 'Finance', content: null },
  { path: '/finance/budgeting', title: 'Budgeting', moduleName: 'Finance', content: null },
  { path: '/finance/tax', title: 'Tax Compliance', moduleName: 'Finance', content: null },
  
  { path: '/sales/quotations', title: 'Quotations', moduleName: 'Sales', content: null },
  { path: '/sales/orders', title: 'Sales Orders', moduleName: 'Sales', content: null }, 
  { path: '/sales/deliveries', title: 'Deliveries', moduleName: 'Sales', content: null },
  { path: '/sales/invoicing', title: 'Invoicing', moduleName: 'Sales', content: null },
  { path: '/sales/customers', title: 'Customer Management', moduleName: 'Sales', content: CrmCustomersTemplate },

  { path: '/inventory/tracking', title: 'Stock Tracking', moduleName: 'Inventory', content: null }, 
  { path: '/inventory/warehouses', title: 'Warehouses', moduleName: 'Inventory', content: null },
  { path: '/inventory/receipt', title: 'Goods Receipt', moduleName: 'Inventory', content: null },
  { path: '/inventory/issue', title: 'Goods Issue', moduleName: 'Inventory', content: null },
  { path: '/inventory/transfers', title: 'Stock Transfers', moduleName: 'Inventory', content: null },

  { path: '/hr/employees', title: 'Employee Records', moduleName: 'Human Resources', content: HrEmployeesTemplate },
  { path: '/hr/payroll', title: 'Payroll', moduleName: 'Human Resources', content: HrPayrollTemplate },
  { path: '/hr/attendance', title: 'Attendance', moduleName: 'Human Resources', content: null },
  { path: '/hr/leave', title: 'Leave Management', moduleName: 'Human Resources', content: null },
  { path: '/hr/benefits', title: 'Benefits', moduleName: 'Human Resources', content: null },

  { path: '/procurement/orders', title: 'Purchase Orders', moduleName: 'Procurement', content: null }, 
  { path: '/procurement/suppliers', title: 'Supplier Management', moduleName: 'Procurement', content: ProcurementSuppliersTemplate },
  { path: '/procurement/requests', title: 'Purchase Requests', moduleName: 'Procurement', content: null },
  { path: '/procurement/invoices', title: 'Vendor Invoices', moduleName: 'Procurement', content: null },

  { path: '/production/orders', title: 'Manufacturing Orders', moduleName: 'Production', content: null }, 
  { path: '/production/bom', title: 'Bill of Materials', moduleName: 'Production', content: null },
  { path: '/production/centers', title: 'Work Centers', moduleName: 'Production', content: null },
  { path: '/production/scheduling', title: 'Production Scheduling', moduleName: 'Production', content: null },

  { path: '/crm/leads', title: 'Leads', moduleName: 'CRM', content: null },
  { path: '/crm/opportunities', title: 'Opportunities', moduleName: 'CRM', content: null },
  { path: '/crm/contacts', title: 'Contacts', moduleName: 'CRM', content: CrmCustomersTemplate },
  { path: '/crm/campaigns', title: 'Campaigns', moduleName: 'CRM', content: null },

  { path: '/assets/register', title: 'Asset Register', moduleName: 'Fixed Assets', content: null },
  { path: '/assets/depreciation', title: 'Depreciation', moduleName: 'Fixed Assets', content: null },
  { path: '/assets/maintenance', title: 'Maintenance', moduleName: 'Fixed Assets', content: null },

  { path: '/reports/financial', title: 'Financial Reports', moduleName: 'Reports & Analytics', content: null },
  { path: '/reports/sales', title: 'Sales Reports', moduleName: 'Reports & Analytics', content: null },
  { path: '/reports/inventory', title: 'Inventory Reports', moduleName: 'Reports & Analytics', content: null },
  { path: '/reports/hr', title: 'HR Analytics', moduleName: 'Reports & Analytics', content: null },
  { path: '/reports/custom', title: 'Custom Reports', moduleName: 'Reports & Analytics', content: null },

  { path: '/settings/organization', title: 'Organization Settings', moduleName: 'Settings', content: null },
  { path: '/settings/users', title: 'Users & Roles', moduleName: 'Settings', content: null },
  { path: '/settings/modules', title: 'Modules & Subscriptions', moduleName: 'Settings', content: null },
  { path: '/settings/integrations', title: 'Integration Settings', moduleName: 'Settings', content: null },
];

for (const route of routes) {
  const fullPath = path.join(appDir, route.path);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const filePath = path.join(fullPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const content = route.content || genericTemplate(route.title, route.moduleName);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Generated ' + filePath);
  } else {
    // Overwrite the existing to apply the new template anyway (unless it's empty state)
    // Actually just overwrite the empty states to be sure they have proper boilerplate
    // Actually the user didn't have these, they were 404
    const content = route.content || genericTemplate(route.title, route.moduleName);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Overwrote ' + filePath);
  }
}

console.log('Done scaffolding missing pages!');
