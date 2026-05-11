"use client";

import type { FormEvent } from "react";
import { FormField, FormSection, SelectField, TextareaField } from "@/components/form/form-field";
import { GhostButton, SecondaryButton } from "@/components/ui/button";

export interface ChoiceValue {
  choice_text: string;
  is_correct: boolean;
}

export interface QuestionFormValues {
  questionSetId: string;
  type: string;
  questionText: string;
  explanation: string;
  imageUrl: string;
  difficulty: string;
  orderNo: string;
  isActive: boolean;
  choices: ChoiceValue[];
}

export interface QuestionFormErrors {
  questionSetId?: string;
  type?: string;
  questionText?: string;
  explanation?: string;
  imageUrl?: string;
  difficulty?: string;
  orderNo?: string;
}

interface QuestionFormProps {
  formId?: string;
  values: QuestionFormValues;
  errors: QuestionFormErrors;
  disabled?: boolean;
  onChange: <K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultQuestionFormValues: QuestionFormValues = {
  questionSetId: "",
  type: "MULTIPLE_CHOICE",
  questionText: "",
  explanation: "",
  imageUrl: "",
  difficulty: "1",
  orderNo: "1",
  isActive: true,
  choices: [{ choice_text: "", is_correct: false }],
};

export function validateQuestionForm(values: QuestionFormValues): QuestionFormErrors {
  const errors: QuestionFormErrors = {};
  if (!values.questionSetId.trim()) errors.questionSetId = "Question Set ID is required.";
  if (!values.type.trim()) errors.type = "Type is required.";
  if (!values.questionText.trim()) errors.questionText = "Question text is required.";
  if (values.difficulty.trim()) {
    const d = Number(values.difficulty);
    if (!Number.isInteger(d) || d < 1 || d > 5) errors.difficulty = "Difficulty must be between 1 and 5.";
  }
  if (values.orderNo.trim()) {
    const n = Number(values.orderNo);
    if (!Number.isInteger(n) || n < 1) errors.orderNo = "Order must be a positive integer.";
  }
  return errors;
}

export function QuestionForm({ formId, values, errors, disabled = false, onChange, onSubmit }: QuestionFormProps) {
  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.questionSetId}
          hint="UUID of the parent question set."
          label="Question Set ID"
          onChange={(e) => onChange("questionSetId", e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={values.questionSetId}
        />
        <SelectField
          required
          disabled={disabled}
          error={errors.type}
          label="Type"
          value={values.type}
          onChange={(e) => onChange("type", e.target.value)}
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
          <option value="DRAG_DROP">Drag &amp; Drop</option>
          <option value="REORDER">Reorder</option>
          <option value="TYPING">Typing</option>
        </SelectField>
        <SelectField
          required
          disabled={disabled}
          error={errors.difficulty}
          label="Difficulty"
          value={values.difficulty}
          onChange={(e) => onChange("difficulty", e.target.value)}
        >
          <option value="1">1 — Very Easy</option>
          <option value="2">2 — Easy</option>
          <option value="3">3 — Medium</option>
          <option value="4">4 — Hard</option>
          <option value="5">5 — Very Hard</option>
        </SelectField>
        <FormField
          required
          disabled={disabled}
          error={errors.orderNo}
          label="Order No."
          min={1}
          onChange={(e) => onChange("orderNo", e.target.value)}
          placeholder="1"
          type="number"
          value={values.orderNo}
        />
        <FormField
          disabled={disabled}
          error={errors.imageUrl}
          hint="Optional. URL to an image for this question."
          label="Image URL"
          onChange={(e) => onChange("imageUrl", e.target.value)}
          placeholder="https://..."
          value={values.imageUrl}
        />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800">Active Status</span>
          <button
            className={`flex min-h-11.5 items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
              values.isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-(--border) bg-white text-slate-700"
            }`}
            disabled={disabled}
            onClick={(e) => { e.preventDefault(); onChange("isActive", !values.isActive); }}
            type="button"
          >
            <span>{values.isActive ? "Active" : "Inactive"}</span>
            <span className="text-xs font-semibold tracking-[0.12em] uppercase">
              {values.isActive ? "Enabled" : "Disabled"}
            </span>
          </button>
        </label>
      </FormSection>

      <TextareaField
        required
        disabled={disabled}
        error={errors.questionText}
        label="Question Text"
        onChange={(e) => onChange("questionText", e.target.value)}
        placeholder="What color is the sky?"
        value={values.questionText}
      />

      <TextareaField
        disabled={disabled}
        error={errors.explanation}
        label="Explanation"
        onChange={(e) => onChange("explanation", e.target.value)}
        placeholder="Optional explanation shown after answering."
        value={values.explanation}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">Choices</span>
          <SecondaryButton
            type="button"
            className="h-8 px-3 text-xs"
            onClick={() => onChange("choices", [...values.choices, { choice_text: "", is_correct: false }])}
          >
            + Add Choice
          </SecondaryButton>
        </div>
        {values.choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-(--border) bg-white px-3 py-2 text-sm outline-none focus:border-(--primary)"
              disabled={disabled}
              placeholder={`Choice ${index + 1}`}
              value={choice.choice_text}
              onChange={(e) => {
                const next = [...values.choices];
                next[index] = { ...next[index], choice_text: e.target.value };
                onChange("choices", next);
              }}
            />
            <label className="flex items-center gap-1.5 text-sm text-slate-600 whitespace-nowrap">
              <input
                type="checkbox"
                checked={choice.is_correct}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...values.choices];
                  next[index] = { ...next[index], is_correct: e.target.checked };
                  onChange("choices", next);
                }}
              />
              Correct
            </label>
            {values.choices.length > 1 && (
              <GhostButton
                type="button"
                className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50"
                disabled={disabled}
                onClick={() => onChange("choices", values.choices.filter((_, i) => i !== index))}
              >
                ×
              </GhostButton>
            )}
          </div>
        ))}
      </div>
    </form>
  );
}
