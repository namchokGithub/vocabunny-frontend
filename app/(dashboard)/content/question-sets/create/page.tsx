"use client";

import { FormField, FormSection, TextareaField } from "@/components/form/form-field";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { contentApi } from "@/lib/api";
import {
  defaultQuestionSetValues,
  toCreateQuestionSetPayload,
  validateQuestionSetForm,
  type QuestionSetFormErrors,
  type QuestionSetFormValues,
} from "@/lib/validation/question-set";
import { useState } from "react";

export default function CreateQuestionSetPage() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<QuestionSetFormValues>(defaultQuestionSetValues);
  const [errors, setErrors] = useState<QuestionSetFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState(
    "Future integration point for success and error toasts after create/update actions.",
  );

  function updateField<K extends keyof QuestionSetFormValues>(
    key: K,
    value: QuestionSetFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handlePublish() {
    const nextErrors = validateQuestionSetForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const payload = toCreateQuestionSetPayload(values);
      const result = await contentApi.createQuestionSet(payload);
      setSubmitMessage(
        `Mock submit completed for ${result.id}. Connect this flow to a real endpoint later.`,
      );
      setOpen(true);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <SecondaryButton>Save Draft</SecondaryButton>
            <PrimaryButton onClick={handlePublish}>Publish Set</PrimaryButton>
          </>
        }
        description="Basic form scaffold for building new question sets. Hook this to a real API later."
        title="Create Question Set"
      />

      <section className="card rounded-[28px] p-6">
        <form className="space-y-5">
          <FormSection>
            <FormField
              error={errors.title}
              label="Set Title"
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Enter question set title"
              value={values.title}
            />
            <FormField
              error={errors.lessonId}
              label="Lesson ID"
              onChange={(event) => updateField("lessonId", event.target.value)}
              placeholder="LES-001"
              value={values.lessonId}
            />
            <FormField
              error={errors.unitId}
              label="Unit ID"
              onChange={(event) => updateField("unitId", event.target.value)}
              placeholder="UNT-001"
              value={values.unitId}
            />
            <FormField
              error={errors.difficulty}
              hint="Allowed values: easy, medium, hard"
              label="Difficulty"
              onChange={(event) =>
                updateField("difficulty", event.target.value as QuestionSetFormValues["difficulty"])
              }
              placeholder="easy"
              value={values.difficulty}
            />
            <FormField
              error={errors.status}
              hint="Allowed values: active, draft, archived, paused"
              label="Status"
              onChange={(event) =>
                updateField("status", event.target.value as QuestionSetFormValues["status"])
              }
              placeholder="draft"
              value={values.status}
            />
            <FormField
              className="md:col-span-2"
              hint="Comma-separated values"
              label="Tags"
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="starter, review, speaking"
              value={values.tags}
            />
          </FormSection>
          <TextareaField
            className="md:col-span-2"
            error={errors.description}
            hint="Describe what this set is used for and any release note for staff."
            label="Description"
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Question set notes..."
            value={values.description}
          />
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="card rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-slate-950">Rules</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Question sets should reference valid lesson and unit identifiers.</li>
            <li>Tags should remain normalized for filtering and future taxonomy usage.</li>
            <li>Validation is isolated in `lib/validation` for future schema-based forms.</li>
          </ul>
        </div>
        <div className="card rounded-[28px] p-6">
          <h3 className="text-lg font-semibold text-slate-950">Mock Submit Status</h3>
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-slate-50 p-4 text-sm text-slate-600">
            {submitMessage}
          </div>
        </div>
      </section>

      <ConfirmDialog
        description="Mock submit completed. Replace this confirmation flow with real mutation success handling later."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Publish Question Set?"
      />
    </div>
  );
}
