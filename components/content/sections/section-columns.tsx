"use client";

import type { Column } from "@/components/table/data-table";
import type { Section } from "@/lib/api/content/sections";

export const sectionColumns: Column<Section>[] = [
  {
    key: "title",
    header: "Title",
    render: (section) => section.title || "-",
  },
  {
    key: "slug",
    header: "Slug",
  },
  {
    key: "description",
    header: "Description",
    render: (section) => section.description || "-",
  },
  {
    key: "order_no",
    header: "Order",
  },
  {
    key: "is_published",
    header: "Status",
    render: (section) => (section.is_published ? "Published" : "Draft"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (section) => new Date(section.updated_at).toLocaleDateString(),
  },
];
