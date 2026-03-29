import React from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  DollarSign, TrendingDown, Package, Users,
  PlusCircle, ArrowRight, TrendingUp, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { getDashboardMetrics, getRecentActivity } from '@/app/actions';

export default async function DashboardPage() {
  const date = new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [metrics, activity] = await Promise.all([getDashboardMetrics(), getRecentActivity()]);

  const fmt = (n: number) => `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-muted-foreground font-medium mb-2" suppressHydrationWarning>{date}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Business Overview</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/sales" className="btn-primary gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Record Sale</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: fmt(metrics.totalRevenue), icon: DollarSign, color: 'primary' },
            { label: 'Total Expenses', value: fmt(metrics.totalExpenses), icon: TrendingDown, color: 'destructive' },
            { label: 'Net Profit', value: fmt(metrics.netProfit), icon: TrendingUp, color: metrics.netProfit >= 0 ? 'primary' : 'destructive' },
            { label: 'Active Staff', value: String(metrics.employees), icon: Users, color: 'secondary' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-premium p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-${color}/10 text-${color} rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Products</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics.products}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Sales</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics.sales}</h3>
            </div>
          </div>
          <div className="card-premium p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${metrics.pendingSales > 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Pending Sales</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics.pendingSales}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 card-premium p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
              <Link href="/finance" className="text-primary font-medium flex items-center gap-1 hover:underline text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {activity.recentSales.length === 0 ? (
              <div className="p-6 bg-muted/10 rounded-xl text-center border-2 border-dashed border-border">
                <p className="text-muted-foreground">No recent activity. Record a sale to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.recentSales.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <div>
                      <p className="font-semibold text-foreground">{s.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.customer?.name ?? 'Walk-in'} · {s.quantity} units · {new Date(s.saleDate).toLocaleDateString('en-KE')}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-primary">
                      +{fmt(s.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-8 bg-primary text-primary-foreground">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { href: '/sales', label: 'Record Sale', icon: DollarSign },
                { href: '/inventory', label: 'Add Inventory', icon: Package },
                { href: '/finance', label: 'Record Expense', icon: TrendingDown },
                { href: '/procurement', label: 'Create PO', icon: PlusCircle },
                { href: '/hr', label: 'Add Employee', icon: Users },
                { href: '/reports', label: 'View Reports', icon: ArrowRight },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="w-full flex items-center justify-between p-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-xl transition-colors">
                  <span className="font-medium">{label}</span>
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
