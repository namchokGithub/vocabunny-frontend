"use client";

import type { FormEvent } from "react";
import { FormField, FormSection, SelectField, TextareaField } from "@/components/form/form-field";

export interface QuestionSetFormValues {
  title: string;
  slug: string;
  description: string;
  unitId: string;
  orderNo: string;
  estimatedSeconds: string;
  version: string;
  isPublished: boolean;
}

export interface QuestionSetFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  unitId?: string;
  orderNo?: string;
  estimatedSeconds?: string;
  version?: string;
}

interface QuestionSetFormProps {
  formId?: string;
  values: QuestionSetFormValues;
  errors: QuestionSetFormErrors;
  disabled?: boolean;
  units: { id: string; title: string }[];
  onChange: <K extends keyof QuestionSetFormValues>(key: K, value: QuestionSetFormValues[K]) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultQuestionSetFormValues: QuestionSetFormValues = {
  title: "",
  slug: "",
  description: "",
  unitId: "",
  orderNo: "1",
  estimatedSeconds: "",
  version: "1",
  isPublished: false,
};

export function normalizeQuestionSetTitle(value: string) {
  return value.replace(/[^A-Za-z0-9 -]+/g, "");
}

export function normalizeQuestionSetSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateQuestionSetForm(values: QuestionSetFormValues): QuestionSetFormErrors {
  const errors: QuestionSetFormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  if (!values.unitId.trim()) errors.unitId = "Unit is required.";
  if (values.orderNo.trim()) {
    const n = Number(values.orderNo);
    if (!Number.isInteger(n) || n < 1) errors.orderNo = "Order must be a positive integer.";
  }
  if (!values.version.trim()) {
    errors.version = "Version is required.";
  } else {
    const v = Number(values.version);
    if (!Number.isInteger(v) || v < 1) errors.version = "Version must be a positive integer.";
  }
  if (values.estimatedSeconds.trim()) {
    const s = Number(values.estimatedSeconds);
    if (!Number.isInteger(s) || s < 1) errors.estimatedSeconds = "Estimated seconds must be a positive integer.";
  }
  return errors;
}

export function QuestionSetForm({ formId, values, errors, disabled = false, units, onChange, onSubmit }: QuestionSetFormProps) {
  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.title}
          label="Title"
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Colors Quiz Set"
          value={values.title}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.slug}
          hint="Used in URLs. Example: colors-quiz-set"
          label="Slug"
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="colors-quiz-set"
          value={values.slug}
        />
        <SelectField
          required
          disabled={disabled}
          error={errors.unitId}
          label="Unit"
          value={values.unitId}
          onChange={(e) => onChange("unitId", e.target.value)}
        >
          <option value="">— Select a unit —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>{u.title}</option>
          ))}
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
          required
          disabled={disabled}
          error={errors.version}
          label="Version"
          min={1}
          onChange={(e) => onChange("version", e.target.value)}
          placeholder="1"
          type="number"
          value={values.version}
        />
        <FormField
          disabled={disabled}
          error={errors.estimatedSeconds}
          hint="Optional. Approximate time to complete in seconds."
          label="Estimated Seconds"
          min={1}
          onChange={(e) => onChange("estimatedSeconds", e.target.value)}
          placeholder="300"
          type="number"
          value={values.estimatedSeconds}
        />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800">Publish Status</span>
          <button
            className={`flex min-h-11.5 items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
              values.isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-(--border) bg-white text-slate-700"
            }`}
            disabled={disabled}
            onClick={(e) => { e.preventDefault(); onChange("isPublished", !values.isPublished); }}
            type="button"
          >
            <span>{values.isPublished ? "Published" : "Draft"}</span>
            <span className="text-xs font-semibold tracking-[0.12em] uppercase">
              {values.isPublished ? "Visible" : "Hidden"}
            </span>
          </button>
        </label>
      </FormSection>
      <TextareaField
        disabled={disabled}
        error={errors.description}
        label="Description"
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="A set of questions covering color vocabulary."
        value={values.description}
      />
    </form>
  );
}
