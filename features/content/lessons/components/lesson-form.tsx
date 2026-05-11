"use client";

import type { FormEvent } from "react";
import { FormField, FormSection, SelectField, TextareaField } from "@/components/form/form-field";

export interface LessonFormValues {
  title: string;
  slug: string;
  description: string;
  sectionId: string;
  orderNo: string;
  isPublished: boolean;
}

export interface LessonFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  sectionId?: string;
  orderNo?: string;
}

interface LessonFormProps {
  formId?: string;
  values: LessonFormValues;
  errors: LessonFormErrors;
  disabled?: boolean;
  sections: { id: string; title: string }[];
  onChange: <K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultLessonFormValues: LessonFormValues = {
  title: "",
  slug: "",
  description: "",
  sectionId: "",
  orderNo: "1",
  isPublished: false,
};

export function normalizeLessonTitle(value: string) {
  return value.replace(/[^A-Za-z0-9 -]+/g, "");
}

export function normalizeLessonSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateLessonForm(values: LessonFormValues): LessonFormErrors {
  const errors: LessonFormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  if (!values.sectionId.trim()) errors.sectionId = "Section is required.";
  if (values.orderNo.trim()) {
    const n = Number(values.orderNo);
    if (!Number.isInteger(n) || n < 1) errors.orderNo = "Order must be a positive integer.";
  }
  return errors;
}

export function LessonForm({ formId, values, errors, disabled = false, sections, onChange, onSubmit }: LessonFormProps) {
  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.title}
          label="Title"
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Colors & Shapes"
          value={values.title}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.slug}
          hint="Used in URLs. Example: colors-and-shapes"
          label="Slug"
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="colors-and-shapes"
          value={values.slug}
        />
        <SelectField
          required
          disabled={disabled}
          error={errors.sectionId}
          label="Section"
          value={values.sectionId}
          onChange={(e) => onChange("sectionId", e.target.value)}
        >
          <option value="">— Select a section —</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
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
        placeholder="Learn basic color and shape vocabulary."
        value={values.description}
      />
    </form>
  );
}
