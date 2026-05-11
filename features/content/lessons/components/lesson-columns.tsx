"use client";

import type { Column } from "@/components/table/data-table";
import { TruncatedText } from "@/components/ui/truncated-text";
import { PublishedBadge } from "@/components/ui/published-badge";
import type { Lesson } from "@/lib/api/content/lessons";
import { LessonRowActions } from "./lesson-row-actions";
import { formatDateTime } from "@/lib/utils";

interface CreateLessonColumnsOptions {
  onEdit?: (lesson: Lesson) => Promise<void>;
  onDelete?: (lesson: Lesson) => Promise<void>;
}

export function createLessonColumns({ onEdit, onDelete }: CreateLessonColumnsOptions = {}): Column<Lesson>[] {
  return [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortKey: "title",
      render: (lesson) => (
        <div>
          <p className="font-semibold text-slate-900">{lesson.title || "-"}</p>
          <p className="mt-1 text-xs text-slate-500">{lesson.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "max-w-[300px]",
      render: (lesson) => (
        <TruncatedText lines={2} className="text-slate-600">
          {lesson.description || "-"}
        </TruncatedText>
      ),
    },
    {
      key: "section_id",
      header: "Section ID",
      width: "200px",
      render: (lesson) => (
        <span className="font-mono text-xs text-slate-500">{lesson.section_id}</span>
      ),
    },
    {
      key: "order_no",
      header: "Order",
      width: "80px",
      align: "center",
      sortable: true,
      sortKey: "order_no",
      render: (lesson) => lesson.order_no,
    },
    {
      key: "is_published",
      header: "Status",
      width: "120px",
      align: "center",
      sortable: true,
      sortKey: "is_published",
      render: (lesson) => <PublishedBadge isPublished={lesson.is_published} />,
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (lesson) => formatDateTime(lesson.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (lesson) => (
        <LessonRowActions lesson={lesson} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
