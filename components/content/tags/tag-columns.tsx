"use client";

import type { Column } from "@/components/table/data-table";
import type { Tag } from "@/lib/api/content/tags";

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
    key: "slug",
    header: "Slug",
    render: (tag) => tag.slug || "-",
  },
  {
    key: "color",
    header: "Color",
    render: (tag) => tag.color || "-",
  },
  {
    key: "usage_count",
    header: "Usage",
    render: (tag) => tag.usage_count ?? "-",
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (tag) => new Date(tag.updated_at).toLocaleDateString(),
  },
];
