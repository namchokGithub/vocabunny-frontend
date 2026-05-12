"use client";

import type { Column } from "@/components/table/data-table";
import { TruncatedText } from "@/components/ui/truncated-text";
import { PublishedBadge } from "@/components/ui/published-badge";
import type { QuestionSet } from "@/lib/api/content/question-sets";
import { QuestionSetRowActions } from "./question-set-row-actions";
import { formatDateTime } from "@/lib/utils";

interface CreateQuestionSetColumnsOptions {
  onEdit?: (questionSet: QuestionSet) => Promise<void>;
  onDelete?: (questionSet: QuestionSet) => Promise<void>;
}

export function createQuestionSetColumns({ onEdit, onDelete }: CreateQuestionSetColumnsOptions = {}): Column<QuestionSet>[] {
  return [
    {
      key: "title",
      header: "Title",
      sortable: true,
      sortKey: "title",
      render: (qs) => (
        <div>
          <p className="font-semibold text-slate-900">{qs.title || "-"}</p>
          <p className="mt-1 text-xs text-slate-500">{qs.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "max-w-[300px]",
      render: (qs) => (
        <TruncatedText lines={2} className="text-slate-600">
          {qs.description || "-"}
        </TruncatedText>
      ),
    },
    {
      key: "unit",
      header: "Unit",
      width: "200px",
      render: (qs) => (
        <span className="text-sm text-slate-700">{qs.unit?.title ?? "-"}</span>
      ),
    },
    {
      key: "version",
      header: "Version",
      width: "90px",
      align: "center",
      sortable: true,
      sortKey: "version",
      render: (qs) => qs.version,
    },
    {
      key: "estimated_seconds",
      header: "Est. Time",
      width: "100px",
      align: "center",
      render: (qs) =>
        qs.estimated_seconds != null ? (
          <span className="text-slate-600">{qs.estimated_seconds}s</span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: "is_published",
      header: "Status",
      width: "120px",
      align: "center",
      sortable: true,
      sortKey: "is_published",
      render: (qs) => <PublishedBadge isPublished={qs.is_published} />,
    },
    {
      key: "updated_at",
      header: "Updated At",
      width: "180px",
      sortable: true,
      sortKey: "updated_at",
      render: (qs) => formatDateTime(qs.updated_at),
    },
    {
      key: "actions",
      header: "Actions",
      width: "160px",
      align: "right",
      render: (qs) => (
        <QuestionSetRowActions questionSet={qs} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
