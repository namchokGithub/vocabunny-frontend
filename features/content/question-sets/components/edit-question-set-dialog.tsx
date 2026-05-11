"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  QuestionSetForm,
  defaultQuestionSetFormValues,
  normalizeQuestionSetSlug,
  normalizeQuestionSetTitle,
  validateQuestionSetForm,
  type QuestionSetFormErrors,
  type QuestionSetFormValues,
} from "@/features/content/question-sets/components/question-set-form";
import type { QuestionSet } from "@/lib/api/content/question-sets";
import { questionSetsService } from "@/lib/services/content/question-sets.service";
import { unitsService } from "@/lib/services/content/units.service";

interface EditQuestionSetDialogProps {
  open: boolean;
  questionSet: QuestionSet | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toQuestionSetFormValues(questionSet: QuestionSet): QuestionSetFormValues {
  return {
    title: questionSet.title,
    slug: questionSet.slug,
    description: questionSet.description ?? "",
    unitId: questionSet.unit_id,
    orderNo: String(questionSet.order_no),
    estimatedSeconds: questionSet.estimated_seconds != null ? String(questionSet.estimated_seconds) : "",
    version: String(questionSet.version),
    isPublished: questionSet.is_published,
  };
}

export function EditQuestionSetDialog({ open, questionSet, onClose, onUpdated }: EditQuestionSetDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [units, setUnits] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<QuestionSetFormValues>(
    questionSet ? toQuestionSetFormValues(questionSet) : defaultQuestionSetFormValues,
  );
  const [errors, setErrors] = useState<QuestionSetFormErrors>({});

  useEffect(() => {
    if (questionSet) {
      setValues(toQuestionSetFormValues(questionSet));
      setErrors({});
    }
  }, [questionSet]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;
    setIsLoadingParents(true);
    unitsService.getUnits({ limit: 200, sort_by: "order_no", sort_order: "ASC" })
      .then((result) => {
        if (!isActive) return;
        setUnits(result.items.map((u) => ({ id: u.id, title: u.title })).sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch((error) => {
        if (!isActive) return;
        showToast({
          title: "Unable to load units",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      })
      .finally(() => { if (isActive) setIsLoadingParents(false); });
    return () => { isActive = false; };
  }, [open, showToast]);

  if (!questionSet) return null;

  const activeQuestionSet = questionSet;

  function updateField<K extends keyof QuestionSetFormValues>(key: K, value: QuestionSetFormValues[K]) {
    if (key === "title") {
      setValues((current) => ({
        ...current,
        title: normalizeQuestionSetTitle(String(value)),
      }));
      return;
    }
    if (key === "slug") {
      setValues((current) => ({
        ...current,
        slug: normalizeQuestionSetSlug(String(value)),
      }));
      return;
    }
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toQuestionSetFormValues(activeQuestionSet));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateQuestionSetForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await questionSetsService.updateQuestionSet(activeQuestionSet.id, {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        unit_id: values.unitId.trim(),
        order_no: Number(values.orderNo),
        estimated_seconds: values.estimatedSeconds ? Number(values.estimatedSeconds) : undefined,
        version: Number(values.version) || 1,
        is_published: values.isPublished,
      });

      showToast({
        title: "Question set updated",
        description: "The question set details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update question set",
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
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Edit Question Set</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the question set metadata and publishing state.
            </p>
          </div>
          <SecondaryButton className="rounded-xl" onClick={handleClose}>
            Close
          </SecondaryButton>
        </div>

        <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
          <QuestionSetForm
            disabled={isSubmitting || isLoadingParents}
            errors={errors}
            formId={formId}
            onChange={updateField}
            onSubmit={handleSubmit}
            units={units}
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
