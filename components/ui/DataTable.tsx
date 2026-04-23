import React from "react";
import { cn } from "@/utils/helpers";

import { Column } from "@/types/ui";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowClassName?: string;
  onRowClick?: (item: T) => void;
  hoverable?: boolean;
}

export function DataTable<T>({ 
  columns, 
  data, 
  rowClassName,
  onRowClick,
  hoverable = true
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/30 border-b border-border">
              {columns.map((column, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50",
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors group",
                    hoverable && "hover:bg-accent/20",
                    onRowClick && "cursor-pointer",
                    rowClassName
                  )}
                >
                  {columns.map((column, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={cn(
                        "px-8 py-6",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.cellClassName
                      )}
                    >
                      {column.cell 
                        ? column.cell(item) 
                        : column.accessorKey 
                          ? (item[column.accessorKey] as React.ReactNode)
                          : null
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center text-muted-foreground/40 text-sm font-medium italic">
                  No records matching the current parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
