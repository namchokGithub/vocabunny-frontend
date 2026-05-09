"use client";

import type { Column } from "@/components/table/data-table";
import type { Lesson } from "@/lib/api/content/lessons";

export const lessonColumns: Column<Lesson>[] = [
  {
    key: "title",
    header: "Lesson",
    render: (lesson) => (
      <div>
        <p className="font-semibold text-slate-900">{lesson.title}</p>
        <p className="text-xs text-slate-500">{lesson.id}</p>
      </div>
    ),
  },
  {
    key: "section_id",
    header: "Section",
    render: (lesson) => lesson.section_id,
  },
  {
    key: "order_no",
    header: "Order",
  },
  {
    key: "is_published",
    header: "Status",
    render: (lesson) => (lesson.is_published ? "Published" : "Draft"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (lesson) => new Date(lesson.updated_at).toLocaleDateString(),
  },
];
