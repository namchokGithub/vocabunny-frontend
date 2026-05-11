"use client";

import { useEffect, useId, useState } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  QuestionForm,
  defaultQuestionFormValues,
  validateQuestionForm,
  type QuestionFormErrors,
  type QuestionFormValues,
} from "@/features/content/questions/components/question-form";
import { contentOrderNosService } from "@/lib/services/content/order-nos.service";
import { questionsService } from "@/lib/services/content/questions.service";
import { questionSetsService } from "@/lib/services/content/question-sets.service";
import type { QuestionType } from "@/lib/api/content/questions";

interface CreateQuestionDialogProps {
  onCreated?: () => void;
}

export function CreateQuestionDialog({ onCreated }: CreateQuestionDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLastOrder, setIsLoadingLastOrder] = useState(false);
  const [questionSets, setQuestionSets] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<QuestionFormValues>(defaultQuestionFormValues);
  const [errors, setErrors] = useState<QuestionFormErrors>({});

  function updateField<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(defaultQuestionFormValues);
    setErrors({});
  }

  useEffect(() => {
    if (!open) return;

    let isActive = true;

    async function loadLastOrder() {
      setIsLoadingLastOrder(true);
      setErrors({});
      setValues(defaultQuestionFormValues);
      setQuestionSets([]);

      try {
        const [orderNos, questionSetsResult] = await Promise.all([
          contentOrderNosService.getLastContentOrderNos(),
          questionSetsService.getQuestionSets({ limit: 200, sort_by: "order_no", sort_order: "ASC" }),
        ]);
        if (!isActive) return;
        setValues((current) => ({
          ...current,
          orderNo: String(orderNos.questions + 1 || 1),
        }));
        setQuestionSets(questionSetsResult.items.map((qs) => ({ id: qs.id, title: qs.title })).sort((a, b) => a.title.localeCompare(b.title)));
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

    const nextErrors = validateQuestionForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await questionsService.createQuestion({
        question_set_id: values.questionSetId.trim(),
        type: values.type as QuestionType,
        question_text: values.questionText.trim(),
        explanation: values.explanation.trim() || undefined,
        image_url: values.imageUrl.trim() || undefined,
        difficulty: Number(values.difficulty),
        order_no: Number(values.orderNo),
        is_active: values.isActive,
        choices: values.choices
          .filter((c) => c.choice_text.trim())
          .map((c, i) => ({
            choice_text: c.choice_text.trim(),
            choice_order: i + 1,
            is_correct: c.is_correct,
          })),
      });

      showToast({
        title: "Question created",
        description: "The new question is now available in the content list.",
        variant: "success",
      });

      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (error) {
      showToast({
        title: "Unable to create question",
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
      <PrimaryButton onClick={() => setOpen(true)}>Create Question</PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                  Content Setup
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Create Question</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add a question to an existing question set.
                </p>
              </div>
              <SecondaryButton className="rounded-xl" onClick={handleClose}>
                Close
              </SecondaryButton>
            </div>

            <div className="mt-6 max-h-[60vh] overflow-y-auto rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
              <QuestionForm
                disabled={isSubmitting || isLoadingLastOrder}
                errors={errors}
                formId={formId}
                onChange={updateField}
                onSubmit={handleSubmit}
                questionSets={questionSets}
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
                Create Question
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
