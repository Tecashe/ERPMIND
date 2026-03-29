import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users, ShoppingCart, Mail, Phone, Building2 } from 'lucide-react';
import { getCustomers } from '@/app/actions';

export default async function SalesCustomersPage() {
  const customers = await getCustomers();

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Customer Management</h1>
            <p className="text-muted-foreground">All customers linked across Sales and CRM modules in real-time.</p>
          </div>
          <div className="card-premium px-5 py-3 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">{customers.length}</span>
            <span className="text-muted-foreground text-sm">customers</span>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="card-premium py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No customers yet</h3>
            <p className="text-muted-foreground">Customers are created via the Sales module or CRM contacts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {customers.map((c) => (
              <div key={c.id} className="card-premium p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{c.name}</h3>
                    {c.company && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{c.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 border-t border-border pt-4">
                  {c.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>

                {/* Sales Count */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-bold text-primary">{c._count.sales}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Member since</span>
                  <span>{new Date(c.createdAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
