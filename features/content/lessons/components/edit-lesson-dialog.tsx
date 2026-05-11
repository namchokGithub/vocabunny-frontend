"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

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
import type { Lesson } from "@/lib/api/content/lessons";
import { lessonsService } from "@/lib/services/content/lessons.service";
import { sectionsService } from "@/lib/services/content/sections.service";

interface EditLessonDialogProps {
  open: boolean;
  lesson: Lesson | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toLessonFormValues(lesson: Lesson): LessonFormValues {
  return {
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description ?? "",
    sectionId: lesson.section_id,
    orderNo: String(lesson.order_no),
    isPublished: lesson.is_published,
  };
}

export function EditLessonDialog({ open, lesson, onClose, onUpdated }: EditLessonDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<LessonFormValues>(
    lesson ? toLessonFormValues(lesson) : defaultLessonFormValues,
  );
  const [errors, setErrors] = useState<LessonFormErrors>({});

  useEffect(() => {
    if (lesson) {
      setValues(toLessonFormValues(lesson));
      setErrors({});
    }
  }, [lesson]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;
    setIsLoadingParents(true);
    sectionsService.getSections({ limit: 200, sort_by: "order_no", sort_order: "ASC" })
      .then((result) => {
        if (!isActive) return;
        setSections(result.items.map((s) => ({ id: s.id, title: s.title })).sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch((error) => {
        if (!isActive) return;
        showToast({
          title: "Unable to load sections",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      })
      .finally(() => { if (isActive) setIsLoadingParents(false); });
    return () => { isActive = false; };
  }, [open, showToast]);

  if (!lesson) return null;

  const activeLesson = lesson;

  function updateField<K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) {
    if (key === "title") {
      setValues((current) => ({
        ...current,
        title: normalizeLessonTitle(String(value)),
      }));
      return;
    }
    if (key === "slug") {
      setValues((current) => ({
        ...current,
        slug: normalizeLessonSlug(String(value)),
      }));
      return;
    }
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toLessonFormValues(activeLesson));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLessonForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await lessonsService.updateLesson(activeLesson.id, {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        section_id: values.sectionId.trim(),
        order_no: Number(values.orderNo),
        is_published: values.isPublished,
      });

      showToast({
        title: "Lesson updated",
        description: "The lesson details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update lesson",
        description: error instanceof Error ? error.message : "Please try again.",
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
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Edit Lesson</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the lesson metadata and publishing state.
            </p>
          </div>
          <SecondaryButton className="rounded-xl" onClick={handleClose}>
            Close
          </SecondaryButton>
        </div>

        <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
          <LessonForm
            disabled={isSubmitting || isLoadingParents}
            errors={errors}
            formId={formId}
            onChange={updateField}
            onSubmit={handleSubmit}
            sections={sections}
            values={values}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton disabled={isSubmitting || isLoadingParents} onClick={handleClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={isLoadingParents} isLoading={isSubmitting || isLoadingParents} form={formId} type="submit">
            Save Changes
          </PrimaryButton>
        </div>
      </div>
    </div>
  ) : null;
}
