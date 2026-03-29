import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PageHeader({ title, description, icon, action }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all duration-200 ease-out flex-shrink-0 text-sm sm:text-base"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
