"use client";

import type { Column } from "@/components/table/data-table";
import { TruncatedText } from "@/components/ui/truncated-text";
import type { Question } from "@/lib/api/content/questions";
import { QuestionRowActions } from "./question-row-actions";
import { formatDateTime } from "@/lib/utils";

interface CreateQuestionColumnsOptions {
  onEdit?: (question: Question) => Promise<void>;
  onDelete?: (question: Question) => Promise<void>;
}

export function createQuestionColumns({ onEdit, onDelete }: CreateQuestionColumnsOptions = {}): Column<Question>[] {
  return [
    {
      key: "question_text",
      header: "Question",
      sortable: true,
      sortKey: "type",
      render: (question) => (
        <div>
          <TruncatedText lines={2} className="font-semibold text-slate-900">
            {question.question_text || "-"}
          </TruncatedText>
          <p className="mt-1 font-mono text-xs text-slate-400">{question.id}</p>
        </div>
      ),
    },
    {
      key: "question_set_id",
      header: "Question Set ID",
      width: "200px",
      render: (question) => (
        <span className="font-mono text-xs text-slate-500">{question.question_set_id}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "160px",
      render: (question) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
          {question.type}
        </span>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      width: "100px",
      align: "center",
      sortable: true,
      sortKey: "difficulty",
      render: (question) => question.difficulty,
    },
    {
      key: "is_active",
      header: "Status",
      width: "110px",
      align: "center",
      sortable: true,
      sortKey: "is_active",
      render: (question) => (
        <span
          className={
            question.is_active
              ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
              : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
          }
        >
          {question.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (question) => formatDateTime(question.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (question) => (
        <QuestionRowActions question={question} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
