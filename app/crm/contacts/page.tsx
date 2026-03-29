import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, Mail, Phone, Building2, ShoppingCart } from 'lucide-react';
import { getCustomers } from '@/app/actions';

export default async function CrmContactsPage() {
  const customers = await getCustomers();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Contacts</h1>
          <p className="text-muted-foreground">All customer contacts shared between the Sales and CRM modules in real-time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Contacts</p>
            <h3 className="text-2xl font-bold text-foreground">{customers.length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Companies</p>
            <h3 className="text-2xl font-bold text-foreground">{customers.filter((c) => c.company).length}</h3>
          </div>
          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground font-medium mb-1">Contacts with Orders</p>
            <h3 className="text-2xl font-bold text-primary">{customers.filter((c) => c._count.sales > 0).length}</h3>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="card-premium py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No contacts yet</h3>
            <p className="text-muted-foreground">Record a sale with a customer to create a contact automatically.</p>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-sm">
                    <th className="py-3 px-6 font-semibold">Name</th>
                    <th className="py-3 px-6 font-semibold">Company</th>
                    <th className="py-3 px-6 font-semibold">Email</th>
                    <th className="py-3 px-6 font-semibold">Phone</th>
                    <th className="py-3 px-6 font-semibold text-center">Orders</th>
                    <th className="py-3 px-6 font-semibold">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {c.company ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span>{c.company}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {c.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span>{c.email}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {c.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          c._count.sales > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {c._count.sales}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                      </td>
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
