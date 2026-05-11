"use client";

import { useEffect, useId, useState } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  LessonForm,
  defaultLessonFormValues,
  normalizeLessonSlug,
  normalizeLessonTitle,
  validateLessonForm,
  type LessonFormErrors,
  type LessonFormValues,
} from "@/features/content/lessons/components/lesson-form";
import { contentOrderNosService } from "@/lib/services/content/order-nos.service";
import { lessonsService } from "@/lib/services/content/lessons.service";
import { sectionsService } from "@/lib/services/content/sections.service";

interface CreateLessonDialogProps {
  onCreated?: () => void;
}

export function CreateLessonDialog({ onCreated }: CreateLessonDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLastOrder, setIsLoadingLastOrder] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<LessonFormValues>(defaultLessonFormValues);
  const [errors, setErrors] = useState<LessonFormErrors>({});

  function updateField<K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) {
    setValues((current) => {
      if (key === "title") {
        const nextTitle = normalizeLessonTitle(String(value));
        const nextValues = { ...current, title: nextTitle };
        if (!isSlugManuallyEdited) {
          nextValues.slug = normalizeLessonSlug(nextTitle);
        }
        return nextValues;
      }
      if (key === "slug") {
        const nextSlug = normalizeLessonSlug(String(value));
        setIsSlugManuallyEdited(nextSlug !== normalizeLessonSlug(current.title));
        return { ...current, slug: nextSlug };
      }
      return { ...current, [key]: value };
    });
  }

  function resetForm() {
    setValues(defaultLessonFormValues);
    setErrors({});
    setIsSlugManuallyEdited(false);
  }

  useEffect(() => {
    if (!open) return;

    let isActive = true;

    async function loadLastOrder() {
      setIsLoadingLastOrder(true);
      setErrors({});
      setIsSlugManuallyEdited(false);
      setValues(defaultLessonFormValues);
      setSections([]);

      try {
        const [orderNos, sectionsResult] = await Promise.all([
          contentOrderNosService.getLastContentOrderNos(),
          sectionsService.getSections({ limit: 200, sort_by: "order_no", sort_order: "ASC" }),
        ]);
        if (!isActive) return;
        setValues((current) => ({
          ...current,
          orderNo: String(orderNos.lessons + 1 || 1),
        }));
        setSections(sectionsResult.items.map((s) => ({ id: s.id, title: s.title })).sort((a, b) => a.title.localeCompare(b.title)));
      } catch (error) {
        if (!isActive) return;
        showToast({
          title: "Unable to load form data",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      } finally {
        if (isActive) setIsLoadingLastOrder(false);
      }
    }

    void loadLastOrder();

    return () => {
      isActive = false;
    };
  }, [open, showToast]);

  function handleClose() {
    if (isSubmitting || isLoadingLastOrder) return;
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLessonForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await lessonsService.createLesson({
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        section_id: values.sectionId.trim(),
        order_no: Number(values.orderNo),
        is_published: values.isPublished,
      });

      showToast({
        title: "Lesson created",
        description: "The new lesson is now available in the content list.",
        variant: "success",
      });

      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (error) {
      showToast({
        title: "Unable to create lesson",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
      setRefreshKey((current) => current + 1);
    }
  }

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>Create Lesson</PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                  Content Setup
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Create Lesson</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add a lesson under an existing section.
                </p>
              </div>
              <SecondaryButton className="rounded-xl" onClick={handleClose}>
                Close
              </SecondaryButton>
            </div>

            <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
              <LessonForm
                disabled={isSubmitting || isLoadingLastOrder}
                errors={errors}
                formId={formId}
                onChange={updateField}
                onSubmit={handleSubmit}
                sections={sections}
                values={values}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <SecondaryButton disabled={isSubmitting || isLoadingLastOrder} onClick={handleClose}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={isLoadingLastOrder}
                isLoading={isSubmitting || isLoadingLastOrder}
                form={formId}
                type="submit"
              >
                Create Lesson
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
