"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  SectionForm,
  defaultSectionFormValues,
  validateSectionForm,
  type SectionFormErrors,
  type SectionFormValues,
} from "@/features/content/sections/components/section-form";
import type { Section } from "@/lib/api/content/sections";
import { sectionsService } from "@/lib/services/content/sections.service";

interface EditSectionDialogProps {
  open: boolean;
  section: Section | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toSectionFormValues(section: Section): SectionFormValues {
  return {
    title: section.title,
    slug: section.slug,
    description: section.description ?? "",
    orderNo: String(section.order_no),
    isPublished: section.is_published,
  };
}

export function EditSectionDialog({
  open,
  section,
  onClose,
  onUpdated,
}: EditSectionDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<SectionFormValues>(
    section ? toSectionFormValues(section) : defaultSectionFormValues,
  );
  const [errors, setErrors] = useState<SectionFormErrors>({});

  useEffect(() => {
    if (section) {
      setValues(toSectionFormValues(section));
      setErrors({});
    }
  }, [section]);

  if (!section) {
    return null;
  }

  const activeSection = section;

  function updateField<K extends keyof SectionFormValues>(
    key: K,
    value: SectionFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toSectionFormValues(activeSection));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSectionForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await sectionsService.updateSection(activeSection.id, {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        order_no: Number(values.orderNo),
        is_published: values.isPublished,
      });

      showToast({
        title: "Section updated",
        description: "The section details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update section",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
        <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                Content Setup
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Edit Section
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Update the section metadata and publishing state.
              </p>
            </div>
            <SecondaryButton className="rounded-xl" onClick={handleClose}>
              Close
            </SecondaryButton>
          </div>

          <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
            <SectionForm
              disabled={isSubmitting}
              errors={errors}
              formId={formId}
              onChange={updateField}
              onSubmit={handleSubmit}
              values={values}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton disabled={isSubmitting} onClick={handleClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton disabled={isSubmitting} form={formId} type="submit">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    ) : null;
}
