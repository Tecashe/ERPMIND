'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
}

export function MetricCard({
  icon,
  label,
  value,
  change,
  isPositive = true,
  color = 'primary',
}: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    muted: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200 ease-out p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {change && (
            <p
              className={`text-xs font-medium ${
                isPositive ? 'text-accent' : 'text-destructive'
              }`}
            >
              {isPositive ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: MetricCardProps[];
  columns?: 'auto' | '1' | '2' | '3' | '4';
}

export function StatsGrid({ stats, columns = 'auto' }: StatsGridProps) {
  const gridClasses = {
    auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {stats.map((stat, idx) => (
        <MetricCard key={idx} {...stat} />
      ))}
    </div>
  );
}
