"use client";

import { useEffect, useId, useState } from "react";

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
import { contentOrderNosService } from "@/lib/services/content/order-nos.service";
import { questionSetsService } from "@/lib/services/content/question-sets.service";
import { unitsService } from "@/lib/services/content/units.service";

interface CreateQuestionSetDialogProps {
  onCreated?: () => void;
}

export function CreateQuestionSetDialog({ onCreated }: CreateQuestionSetDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLastOrder, setIsLoadingLastOrder] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [units, setUnits] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<QuestionSetFormValues>(defaultQuestionSetFormValues);
  const [errors, setErrors] = useState<QuestionSetFormErrors>({});

  function updateField<K extends keyof QuestionSetFormValues>(key: K, value: QuestionSetFormValues[K]) {
    setValues((current) => {
      if (key === "title") {
        const nextTitle = normalizeQuestionSetTitle(String(value));
        const nextValues = { ...current, title: nextTitle };
        if (!isSlugManuallyEdited) {
          nextValues.slug = normalizeQuestionSetSlug(nextTitle);
        }
        return nextValues;
      }
      if (key === "slug") {
        const nextSlug = normalizeQuestionSetSlug(String(value));
        setIsSlugManuallyEdited(nextSlug !== normalizeQuestionSetSlug(current.title));
        return { ...current, slug: nextSlug };
      }
      return { ...current, [key]: value };
    });
  }

  function resetForm() {
    setValues(defaultQuestionSetFormValues);
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
      setValues(defaultQuestionSetFormValues);
      setUnits([]);

      try {
        const [orderNos, unitsResult] = await Promise.all([
          contentOrderNosService.getLastContentOrderNos(),
          unitsService.getUnits({ limit: 200, sort_by: "order_no", sort_order: "ASC" }),
        ]);
        if (!isActive) return;
        setValues((current) => ({
          ...current,
          orderNo: String(orderNos.question_sets + 1 || 1),
        }));
        setUnits(unitsResult.items.map((u) => ({ id: u.id, title: u.title })).sort((a, b) => a.title.localeCompare(b.title)));
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

    const nextErrors = validateQuestionSetForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await questionSetsService.createQuestionSet({
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
        title: "Question set created",
        description: "The new question set is now available in the content list.",
        variant: "success",
      });

      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (error) {
      showToast({
        title: "Unable to create question set",
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
      <PrimaryButton onClick={() => setOpen(true)}>Create Question Set</PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                  Content Setup
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Create Question Set</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add a question set under an existing unit.
                </p>
              </div>
              <SecondaryButton className="rounded-xl" onClick={handleClose}>
                Close
              </SecondaryButton>
            </div>

            <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
              <QuestionSetForm
                disabled={isSubmitting || isLoadingLastOrder}
                errors={errors}
                formId={formId}
                onChange={updateField}
                onSubmit={handleSubmit}
                units={units}
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
                Create Question Set
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
