"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  rows,
  emptyTitle = "No records yet",
  emptyDescription = "Data will appear here once your team starts creating records.",
}: DataTableProps<T>) {
  if (!rows.length) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead className="surface-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3 text-sm text-slate-700", column.className)}
                  >
                    {column.render(row)}
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
