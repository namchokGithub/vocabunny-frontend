"use client";

import type { Column } from "@/components/table/data-table";
import type { Tag } from "@/lib/api/content/tags";
import { formatDateTime } from "@/lib/utils";

export const tagColumns: Column<Tag>[] = [
  {
    key: "name",
    header: "Tag",
    render: (tag) => (
      <div>
        <p className="font-semibold text-slate-900">{tag.name}</p>
        <p className="text-xs text-slate-500">{tag.id}</p>
      </div>
    ),
  },
  {
    key: "color",
    header: "Color",
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
    key: "updated_at",
    header: "Updated At",
    render: (tag) => formatDateTime(tag.updated_at),
  },
];
