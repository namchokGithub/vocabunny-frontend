"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  showRowNumber?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  emptyTitle = "No records yet",
  emptyDescription = "Data will appear here once your team starts creating records.",
  showRowNumber = false,
}: DataTableProps<T>) {
  if (!rows.length) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-(--border)">
          <thead className="surface-muted">
            <tr>
              {showRowNumber ? (
                <th className="w-16 px-4 py-3 text-left text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  No
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/80">
                {showRowNumber ? (
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {index + 1}
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-slate-700",
                      column.className,
                    )}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
