import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { UserPlus, Star, Building2, Phone, Mail, ShoppingBag } from 'lucide-react';
import { getCustomers } from '@/app/actions';
import { AddCustomerModal } from '@/components/modals/add-customer-modal';

export default async function CRMPage() {
  const customers = await getCustomers();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">Customer Relations</h1>
            <p className="text-muted-foreground text-lg">Track your clients and their purchasing history.</p>
          </div>
          <AddCustomerModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><UserPlus className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Customers</p>
              <h3 className="text-2xl font-bold text-foreground">{customers.length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">With Purchases</p>
              <h3 className="text-2xl font-bold text-foreground">{customers.filter(c => c._count.sales > 0).length}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl"><Building2 className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Corporate Clients</p>
              <h3 className="text-2xl font-bold text-foreground">{customers.filter(c => c.company).length}</h3>
            </div>
          </div>
        </div>

        {/* Customer Directory */}
        <div className="card-premium overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Directory</h2>
            {customers.length === 0 ? (
              <div className="py-12 text-center bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No customers yet</h3>
                <p className="text-muted-foreground mb-6">Add your first customer to start tracking relationships.</p>
                <AddCustomerModal />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((c) => (
                  <div key={c.id} className="p-5 bg-muted/20 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{c.name}</h3>
                        {c.company && <p className="text-sm text-muted-foreground">{c.company}</p>}
                      </div>
                    </div>
                    <div className="space-y-1 mb-3">
                      {c.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" /> {c.email}
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" /> {c.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-muted-foreground text-sm">Total Purchases</span>
                      <span className="font-bold text-foreground">{c._count.sales}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
