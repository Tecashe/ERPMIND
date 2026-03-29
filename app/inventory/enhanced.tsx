'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MetricCard, StatsGrid } from '@/components/metric-card';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Database,
  CheckCircle2,
  AlertCircle,
  Warehouse,
  Plus,
  Search,
} from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  warehouse: string;
  unitCost: number;
  totalValue: number;
  status: 'good' | 'warning' | 'critical';
}

export default function InventoryPageEnhanced() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stock' | 'warehouses' | 'movements'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = [
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Total Stock Items',
      value: '2,847',
      change: '+45 this month',
      isPositive: true,
      color: 'primary' as const,
    },
    {
      icon: <Database className="w-5 h-5" />,
      label: 'Stock Value',
      value: '12.3M KES',
      change: '8.5% increase',
      isPositive: true,
      color: 'secondary' as const,
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Low Stock Items',
      value: '34',
      change: '5 critical',
      isPositive: false,
      color: 'accent' as const,
    },
    {
      icon: <Warehouse className="w-5 h-5" />,
      label: 'Warehouse Util.',
      value: '78.5%',
      change: '2.3% from last week',
      isPositive: true,
      color: 'muted' as const,
    },
  ];

  const stockItems: StockItem[] = [
    {
      id: 'SKU-001',
      name: 'Industrial Cement (50kg)',
      sku: 'CEMENT-50',
      quantity: 2345,
      reorderLevel: 500,
      warehouse: 'Main Warehouse',
      unitCost: 450,
      totalValue: 1055250,
      status: 'good',
    },
    {
      id: 'SKU-002',
      name: 'Steel Rods (12mm)',
      sku: 'STEEL-12',
      quantity: 145,
      reorderLevel: 200,
      warehouse: 'Main Warehouse',
      unitCost: 850,
      totalValue: 123250,
      status: 'warning',
    },
    {
      id: 'SKU-003',
      name: 'Paint Thinner (5L)',
      sku: 'PAINT-5L',
      quantity: 8,
      reorderLevel: 50,
      warehouse: 'Secondary',
      unitCost: 1200,
      totalValue: 9600,
      status: 'critical',
    },
  ];

  const warehouses = [
    { name: 'Main Warehouse', location: 'Nairobi Industrial Area', capacity: 5000, current: 3800, items: 1245 },
    { name: 'Secondary Storage', location: 'Mombasa Port', capacity: 2000, current: 1450, items: 456 },
    { name: 'Distribution Center', location: 'Kisumu', capacity: 3000, current: 2100, items: 789 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stock', label: 'Stock Management' },
    { id: 'warehouses', label: 'Warehouses' },
    { id: 'movements', label: 'Stock Movements' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-accent/20 text-accent';
      case 'warning':
        return 'bg-destructive/20 text-destructive';
      case 'critical':
        return 'bg-destructive/20 text-destructive font-semibold';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Inventory Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track stock levels, warehouses, and movements across all locations
            </p>
          </div>
          <button className="px-4 sm:px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all duration-200 ease-out font-medium flex items-center gap-2 whitespace-nowrap text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-min">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out border-b-2 ${
                  selectedTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Key Metrics</h2>
              <StatsGrid stats={metrics} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Critical Items */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-foreground mb-6">Critical Stock Items</h3>
                <div className="space-y-4">
                  {stockItems.filter((item) => item.status === 'critical').map((item) => (
                    <div key={item.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">{item.quantity}</p>
                        <p className="text-xs text-muted-foreground">units</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:brightness-110 transition-all duration-200 ease-out font-medium text-sm">
                  Reorder Now
                </button>
              </div>

              {/* Warehouse Status */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-foreground mb-6">Warehouse Utilization</h3>
                <div className="space-y-6">
                  {warehouses.map((wh) => {
                    const utilPercent = (wh.current / wh.capacity) * 100;
                    return (
                      <div key={wh.name}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground text-sm">{wh.name}</p>
                          <p className="text-xs font-semibold text-primary">{utilPercent.toFixed(0)}%</p>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${utilPercent}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{wh.current} of {wh.capacity} units</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stock Overview Table */}
            <div className="card-premium overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">All Stock Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">SKU</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Value</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stockItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors duration-200 ease-out">
                        <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{item.sku}</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">{(item.totalValue / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Stock Management Tab */}
        {selectedTab === 'stock' && (
          <div className="card-premium p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all duration-200 ease-out font-medium">
                Filter
              </button>
            </div>
            <p className="text-muted-foreground">Stock management interface - ready for full implementation</p>
          </div>
        )}

        {/* Warehouses Tab */}
        {selectedTab === 'warehouses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div key={wh.name} className="card-premium p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground">{wh.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{wh.location}</p>
                  </div>
                  <Warehouse className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Capacity Used</span>
                    <span className="font-semibold text-foreground">{((wh.current / wh.capacity) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(wh.current / wh.capacity) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{wh.current} / {wh.capacity}</span>
                    <span>{wh.items} items</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movements Tab */}
        {selectedTab === 'movements' && (
          <div className="card-premium p-6">
            <p className="text-muted-foreground">Stock movements tracking - ready for full implementation</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
