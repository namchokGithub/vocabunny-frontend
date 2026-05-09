"use client";

import type { Column } from "@/components/table/data-table";
import type { Question } from "@/lib/api/content/questions";

export const questionColumns: Column<Question>[] = [
  {
    key: "question_text",
    header: "Question",
    render: (question) => (
      <div>
        <p className="font-semibold text-slate-900">{question.question_text}</p>
        <p className="text-xs text-slate-500">{question.id}</p>
      </div>
    ),
  },
  {
    key: "question_set_id",
    header: "Question Set",
    render: (question) => question.question_set_id,
  },
  {
    key: "type",
    header: "Type",
  },
  {
    key: "difficulty",
    header: "Difficulty",
  },
  {
    key: "is_active",
    header: "Status",
    render: (question) => (question.is_active ? "Active" : "Inactive"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (question) => new Date(question.updated_at).toLocaleDateString(),
  },
];
