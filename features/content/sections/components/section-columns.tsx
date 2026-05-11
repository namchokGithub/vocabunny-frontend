"use client";

import type { Column } from "@/components/table/data-table";
import { TruncatedText } from "@/components/ui/truncated-text";
import { SectionStatusBadge } from "@/features/content/sections/components/section-status-badge";
import type { Section } from "@/lib/api/content/sections";
import { formatDateTime } from "@/lib/utils";
import { SectionRowActions } from "./section-row-actions";

interface CreateSectionColumnsOptions {
  onEdit?: (section: Section) => Promise<void>;
  onDelete?: (section: Section) => Promise<void>;
}

export function createSectionColumns({
  onEdit,
  onDelete,
}: CreateSectionColumnsOptions = {}): Column<Section>[] {
  return [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortKey: "title",
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
        <TruncatedText lines={2} className="text-slate-600">
          {section.description || "-"}
        </TruncatedText>
      ),
    },
    {
      key: "order_no",
      header: "Order",
      width: "80px",
      align: "center",
      sortable: true,
      sortKey: "order_no",
      render: (section) => section.order_no,
    },
    {
      key: "is_published",
      header: "Status",
      width: "120px",
      align: "center",
      sortable: true,
      sortKey: "is_published",
      render: (section) => (
        <SectionStatusBadge isPublished={section.is_published} />
      ),
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (section) => formatDateTime(section.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (section) => (
        <SectionRowActions
          section={section}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    },
  ];
}
