"use client";

import { SecondaryButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Column } from "@/components/table/data-table";
import type { Lesson, Question, QuestionSet, Unit } from "@/types";
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

export const lessonColumns: Column<Lesson>[] = [
  {
    key: "title",
    header: "Lesson",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.title}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "section", header: "Section", render: (row) => row.section },
  { key: "units", header: "Units", render: (row) => row.units },
  { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    render: () => <SecondaryButton>Edit</SecondaryButton>,
  },
];

export const unitColumns: Column<Unit>[] = [
  {
    key: "title",
    header: "Unit",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.title}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "lesson", header: "Lesson", render: (row) => row.lesson },
  {
    key: "vocabularyCount",
    header: "Vocabulary",
    render: (row) => row.vocabularyCount,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    render: () => <SecondaryButton>Edit</SecondaryButton>,
  },
];

export const questionSetColumns: Column<QuestionSet>[] = [
  {
    key: "title",
    header: "Question Set",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.title}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "lesson", header: "Lesson", render: (row) => row.lesson },
  { key: "unit", header: "Unit", render: (row) => row.unit },
  {
    key: "questionCount",
    header: "Questions",
    render: (row) => row.questionCount,
  },
  { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    render: () => <SecondaryButton>Edit</SecondaryButton>,
  },
];

export const questionColumns: Column<Question>[] = [
  {
    key: "prompt",
    header: "Question",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.prompt}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  {
    key: "questionSet",
    header: "Question Set",
    render: (row) => row.questionSet,
  },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    render: () => <SecondaryButton>Edit</SecondaryButton>,
  },
];
