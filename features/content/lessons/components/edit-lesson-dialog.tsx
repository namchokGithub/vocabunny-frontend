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
          <PrimaryButton isLoading={isSubmitting} form={formId} type="submit">
            Save Changes
          </PrimaryButton>
        </div>
      </div>
    </div>
  ) : null;
}
