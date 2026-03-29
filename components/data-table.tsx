import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  rowClick?: (row: any) => void;
}

export function DataTable({ columns, data, title, rowClick }: DataTableProps) {
  return (
    <div className="card-premium overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide ${column.width || ''}`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => rowClick?.(row)}
                  className="hover:bg-muted/30 transition-colors duration-200 ease-out cursor-pointer group"
                >
                  {columns.map((column) => (
                    <td key={column.key} className={`px-6 py-4 text-sm text-foreground ${column.width || ''}`}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-muted-foreground">No data available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
