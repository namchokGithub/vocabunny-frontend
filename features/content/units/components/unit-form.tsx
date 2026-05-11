"use client";

import type { FormEvent } from "react";
import { FormField, FormSection, TextareaField } from "@/components/form/form-field";

export interface UnitFormValues {
  title: string;
  slug: string;
  description: string;
  lessonId: string;
  orderNo: string;
  isPublished: boolean;
}

export interface UnitFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  lessonId?: string;
  orderNo?: string;
}

interface UnitFormProps {
  formId?: string;
  values: UnitFormValues;
  errors: UnitFormErrors;
  disabled?: boolean;
  onChange: <K extends keyof UnitFormValues>(key: K, value: UnitFormValues[K]) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultUnitFormValues: UnitFormValues = {
  title: "",
  slug: "",
  description: "",
  lessonId: "",
  orderNo: "1",
  isPublished: false,
};

export function normalizeUnitTitle(value: string) {
  return value.replace(/[^A-Za-z0-9 -]+/g, "");
}

export function normalizeUnitSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateUnitForm(values: UnitFormValues): UnitFormErrors {
  const errors: UnitFormErrors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  if (!values.lessonId.trim()) errors.lessonId = "Lesson ID is required.";
  if (values.orderNo.trim()) {
    const n = Number(values.orderNo);
    if (!Number.isInteger(n) || n < 1) errors.orderNo = "Order must be a positive integer.";
  }
  return errors;
}

export function UnitForm({ formId, values, errors, disabled = false, onChange, onSubmit }: UnitFormProps) {
  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.title}
          label="Title"
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Red Things"
          value={values.title}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.slug}
          hint="Used in URLs. Example: red-things"
          label="Slug"
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="red-things"
          value={values.slug}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.lessonId}
          hint="UUID of the parent lesson."
          label="Lesson ID"
          onChange={(e) => onChange("lessonId", e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={values.lessonId}
        />
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
        placeholder="Vocabulary units for red-colored objects."
        value={values.description}
      />
    </form>
  );
}
