"use client";

import type { Column } from "@/components/table/data-table";
import type { QuestionSet } from "@/lib/api/content/question-sets";
import { formatDateTime } from "@/lib/utils";

export const questionSetColumns: Column<QuestionSet>[] = [
  {
    key: "title",
    header: "Question Set",
    render: (questionSet) => (
      <div>
        <p className="font-semibold text-slate-900">{questionSet.title}</p>
        <p className="text-xs text-slate-500">{questionSet.id}</p>
      </div>
    ),
  },
  {
    key: "unit_id",
    header: "Unit",
    render: (questionSet) => questionSet.unit_id,
  },
  {
    key: "version",
    header: "Version",
  },
  {
    key: "estimated_seconds",
    header: "Estimate",
    render: (questionSet) =>
      questionSet.estimated_seconds
        ? `${questionSet.estimated_seconds}s`
        : "-",
  },
  {
    key: "is_published",
    header: "Status",
    render: (questionSet) => (questionSet.is_published ? "Published" : "Draft"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (questionSet) => formatDateTime(questionSet.updated_at),
  },
];
