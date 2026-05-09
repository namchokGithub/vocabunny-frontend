"use client";

import type { Column } from "@/components/table/data-table";
import type { Unit } from "@/lib/api/content/units";

export const unitColumns: Column<Unit>[] = [
  {
    key: "title",
    header: "Unit",
    render: (unit) => (
      <div>
        <p className="font-semibold text-slate-900">{unit.title}</p>
        <p className="text-xs text-slate-500">{unit.id}</p>
      </div>
    ),
  },
  {
    key: "lesson_id",
    header: "Lesson",
    render: (unit) => unit.lesson_id,
  },
  {
    key: "order_no",
    header: "Order",
  },
  {
    key: "is_published",
    header: "Status",
    render: (unit) => (unit.is_published ? "Published" : "Draft"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (unit) => new Date(unit.updated_at).toLocaleDateString(),
  },
];
