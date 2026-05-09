"use client";

import type { Column } from "@/components/table/data-table";
import { SectionStatusBadge } from "@/features/content/sections/components/section-status-badge";
import type { Section } from "@/lib/api/content/sections";

export const sectionColumns: Column<Section>[] = [
  {
    key: "title",
    header: "Title",
    render: (section) => (
      <div>
        <p className="font-semibold text-slate-900">{section.title || "-"}</p>
        <p className="mt-1 text-xs text-slate-500">{section.slug}</p>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    className: "max-w-[360px]",
    render: (section) => (
      <span className="line-clamp-2 text-slate-600">
        {section.description || "-"}
      </span>
    ),
  },
  {
    key: "order_no",
    header: "Order",
    render: (section) => section.order_no,
  },
  {
    key: "is_published",
    header: "Status",
    render: (section) => (
      <SectionStatusBadge isPublished={section.is_published} />
    ),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (section) => new Date(section.updated_at).toLocaleDateString(),
  },
];
