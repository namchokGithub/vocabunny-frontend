"use client";

import type { FormEvent } from "react";

import {
  FormField,
  FormSection,
  TextareaField,
} from "@/components/form/form-field";

export interface SectionFormValues {
  title: string;
  slug: string;
  description: string;
  orderNo: string;
  isPublished: boolean;
}

export interface SectionFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  orderNo?: string;
}

interface SectionFormProps {
  formId?: string;
  values: SectionFormValues;
  errors: SectionFormErrors;
  disabled?: boolean;
  onChange: <K extends keyof SectionFormValues>(
    key: K,
    value: SectionFormValues[K],
  ) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultSectionFormValues: SectionFormValues = {
  title: "",
  slug: "",
  description: "",
  orderNo: "1",
  isPublished: false,
};

export function normalizeSectionTitle(value: string) {
  return value.replace(/[^A-Za-z0-9 -]+/g, "");
}

export function normalizeSectionSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateSectionForm(
  values: SectionFormValues,
): SectionFormErrors {
  const errors: SectionFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (!/^[A-Za-z0-9 -]+$/.test(values.title.trim())) {
    errors.title = "Use English letters, numbers, spaces, and hyphens only.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }

  if (values.orderNo.trim()) {
    const parsedOrder = Number(values.orderNo);

    if (!Number.isInteger(parsedOrder) || parsedOrder < 1) {
      errors.orderNo = "Order must be a positive integer.";
    }
  }

  return errors;
}

export function SectionForm({
  formId,
  values,
  errors,
  disabled = false,
  onChange,
  onSubmit,
}: SectionFormProps) {
  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.title}
          label="Title"
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Beginner Vocab"
          value={values.title}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.slug}
          hint="Used in URLs. Example: beginner-vocab"
          label="Slug"
          onChange={(event) => onChange("slug", event.target.value)}
          placeholder="beginner-vocab"
          value={values.slug}
        />
        <FormField
          required
          disabled={disabled}
          error={errors.orderNo}
          label="Order No."
          min={1}
          onChange={(event) => onChange("orderNo", event.target.value)}
          placeholder="1"
          type="number"
          value={values.orderNo}
        />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800">
            Publish Status
          </span>
          <button
            className={`flex min-h-11.5 items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
              values.isPublished
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-(--border) bg-white text-slate-700"
            }`}
            disabled={disabled}
            onClick={(event) => {
              event.preventDefault();
              onChange("isPublished", !values.isPublished);
            }}
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
        hint="Internal guidance for staff managing this section."
        label="Description"
        onChange={(event) => onChange("description", event.target.value)}
        placeholder="Start here if you are new."
        value={values.description}
      />
    </form>
  );
}
