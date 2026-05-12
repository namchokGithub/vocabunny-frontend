"use client";

import { useState, type FormEvent } from "react";
import { FormField, FormSection } from "@/components/form/form-field";

export interface TagFormValues {
  name: string;
  slug: string;
  color: string;
}

export interface TagFormErrors {
  name?: string;
  slug?: string;
}

interface TagFormProps {
  formId?: string;
  values: TagFormValues;
  errors: TagFormErrors;
  disabled?: boolean;
  onChange: <K extends keyof TagFormValues>(
    key: K,
    value: TagFormValues[K],
  ) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const defaultTagFormValues: TagFormValues = {
  name: "",
  slug: "",
  color: "",
};

export function normalizeTagName(value: string) {
  return value.replace(/[^A-Za-z0-9 _-]+/g, "");
}

export function normalizeTagSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateTagForm(values: TagFormValues): TagFormErrors {
  const errors: TagFormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (values.slug.trim() && !/^[a-z0-9-]+$/.test(values.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  return errors;
}

export function TagForm({
  formId,
  values,
  errors,
  disabled = false,
  onChange,
  onSubmit,
}: TagFormProps) {
  const [slugTouched, setSlugTouched] = useState(false);

  function handleNameChange(value: string) {
    onChange("name", value);

    if (!slugTouched) {
      onChange("slug", normalizeTagSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    const normalizedSlug = normalizeTagSlug(value);

    setSlugTouched(normalizedSlug.length > 0);

    onChange("slug", normalizedSlug);
  }

  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.name}
          label="Name"
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Animals"
          value={values.name}
        />
        <FormField
          disabled={disabled}
          error={errors.slug}
          hint="Optional. Auto-generated from name if left blank."
          label="Slug"
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="animals"
          value={values.slug}
        />
        <FormField
          disabled={disabled}
          hint="Optional. Hex color for this tag."
          label="Color"
          onChange={(e) => onChange("color", e.target.value)}
          placeholder="#3B82F6"
          value={values.color}
        />
      </FormSection>
    </form>
  );
}
