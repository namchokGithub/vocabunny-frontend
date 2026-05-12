"use client";

import type { Column } from "@/components/table/data-table";
import type { Tag } from "@/lib/api/content/tags";
import { TagRowActions } from "./tag-row-actions";
import { formatDateTime } from "@/lib/utils";

interface CreateTagColumnsOptions {
  onEdit?: (tag: Tag) => Promise<void>;
  onDelete?: (tag: Tag) => Promise<void>;
}

export function createTagColumns({ onEdit, onDelete }: CreateTagColumnsOptions = {}): Column<Tag>[] {
  return [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortKey: "name",
      render: (tag) => (
        <p className="font-semibold text-slate-900">{tag.name || "-"}</p>
      ),
    },
    {
      key: "color",
      header: "Color",
      width: "180px",
      render: (tag) =>
        tag.color ? (
          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-slate-200"
              style={{ backgroundColor: tag.color }}
            />
            <span className="font-mono text-xs text-slate-500">{tag.color}</span>
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: "created_at",
      header: "Created At",
      width: "180px",
      render: (tag) => formatDateTime(tag.created_at),
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (tag) => formatDateTime(tag.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (tag) => (
        <TagRowActions tag={tag} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
