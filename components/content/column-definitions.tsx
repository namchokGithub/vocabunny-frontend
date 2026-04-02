"use client";

import { SecondaryButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Column } from "@/components/table/data-table";
import type { Lesson, Question, QuestionSet, Section, Unit } from "@/types";

export const sectionColumns: Column<Section>[] = [
  {
    key: "name",
    header: "Section",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "code", header: "Code", render: (row) => row.code },
  { key: "lessons", header: "Lessons", render: (row) => row.lessons },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "updatedAt", header: "Updated", render: (row) => row.updatedAt },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
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
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
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
  { key: "vocabularyCount", header: "Vocabulary", render: (row) => row.vocabularyCount },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
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
  { key: "questionCount", header: "Questions", render: (row) => row.questionCount },
  { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
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
  { key: "questionSet", header: "Question Set", render: (row) => row.questionSet },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "difficulty", header: "Difficulty", render: (row) => row.difficulty },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
];
