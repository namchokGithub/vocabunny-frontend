"use client";

import type { Column } from "@/components/table/data-table";
import type { QuestionChoice } from "@/lib/api/content/question-choices";

export const questionChoiceColumns: Column<QuestionChoice>[] = [
  {
    key: "choice_text",
    header: "Choice",
    render: (choice) => (
      <div>
        <p className="font-semibold text-slate-900">{choice.choice_text}</p>
        <p className="text-xs text-slate-500">{choice.id}</p>
      </div>
    ),
  },
  {
    key: "question_id",
    header: "Question",
    render: (choice) => choice.question_id,
  },
  {
    key: "choice_order",
    header: "Order",
  },
  {
    key: "is_correct",
    header: "Correct",
    render: (choice) => (choice.is_correct ? "Yes" : "No"),
  },
  {
    key: "updated_at",
    header: "Updated At",
    render: (choice) => new Date(choice.updated_at).toLocaleDateString(),
  },
];
