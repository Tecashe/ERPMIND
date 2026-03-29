import React from 'react';

type Status = 'active' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'approved' | 'rejected';

const statusStyles: Record<Status, { bg: string; text: string; border: string }> = {
  active: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' },
  pending: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  completed: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' },
  cancelled: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
  draft: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  approved: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20' },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {displayLabel}
    </span>
  );
}
