"use client";

import type { Column } from "@/components/table/data-table";
import { TruncatedText } from "@/components/ui/truncated-text";
import { PublishedBadge } from "@/components/ui/published-badge";
import type { Unit } from "@/lib/api/content/units";
import { UnitRowActions } from "./unit-row-actions";
import { formatDateTime } from "@/lib/utils";

interface CreateUnitColumnsOptions {
  onEdit?: (unit: Unit) => Promise<void>;
  onDelete?: (unit: Unit) => Promise<void>;
}

export function createUnitColumns({ onEdit, onDelete }: CreateUnitColumnsOptions = {}): Column<Unit>[] {
  return [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortKey: "title",
      render: (unit) => (
        <div>
          <p className="font-semibold text-slate-900">{unit.title || "-"}</p>
          <p className="mt-1 text-xs text-slate-500">{unit.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "max-w-[300px]",
      render: (unit) => (
        <TruncatedText lines={2} className="text-slate-600">
          {unit.description || "-"}
        </TruncatedText>
      ),
    },
    {
      key: "lesson",
      header: "Lesson",
      width: "200px",
      render: (unit) => (
        <span className="text-sm text-slate-700">{unit.lesson?.title ?? "-"}</span>
      ),
    },
    {
      key: "order_no",
      header: "Order",
      width: "80px",
      align: "center",
      sortable: true,
      sortKey: "order_no",
      render: (unit) => unit.order_no,
    },
    {
      key: "is_published",
      header: "Status",
      width: "120px",
      align: "center",
      sortable: true,
      sortKey: "is_published",
      render: (unit) => <PublishedBadge isPublished={unit.is_published} />,
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (unit) => formatDateTime(unit.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (unit) => (
        <UnitRowActions unit={unit} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
