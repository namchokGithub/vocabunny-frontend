"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  QuestionForm,
  defaultQuestionFormValues,
  validateQuestionForm,
  type QuestionFormErrors,
  type QuestionFormValues,
} from "@/features/content/questions/components/question-form";
import type { Question, QuestionType } from "@/lib/api/content/questions";
import { questionsService } from "@/lib/services/content/questions.service";
import { questionSetsService } from "@/lib/services/content/question-sets.service";

interface EditQuestionDialogProps {
  open: boolean;
  question: Question | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toQuestionFormValues(question: Question): QuestionFormValues {
  return {
    questionSetId: question.question_set_id,
    type: question.type,
    questionText: question.question_text,
    explanation: question.explanation ?? "",
    imageUrl: question.image_url ?? "",
    difficulty: String(question.difficulty),
    orderNo: String(question.order_no),
    isActive: question.is_active,
    choices: question.choices?.map((c) => ({
      choice_text: c.choice_text,
      is_correct: c.is_correct,
    })) ?? [{ choice_text: "", is_correct: false }],
  };
}

export function EditQuestionDialog({ open, question, onClose, onUpdated }: EditQuestionDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [questionSets, setQuestionSets] = useState<{ id: string; title: string }[]>([]);
  const [values, setValues] = useState<QuestionFormValues>(
    question ? toQuestionFormValues(question) : defaultQuestionFormValues,
  );
  const [errors, setErrors] = useState<QuestionFormErrors>({});

  useEffect(() => {
    if (question) {
      setValues(toQuestionFormValues(question));
      setErrors({});
    }
  }, [question]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;
    setIsLoadingParents(true);
    questionSetsService.getQuestionSets({ limit: 200, sort_by: "order_no", sort_order: "ASC" })
      .then((result) => {
        if (!isActive) return;
        setQuestionSets(result.items.map((qs) => ({ id: qs.id, title: qs.title })).sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch((error) => {
        if (!isActive) return;
        showToast({
          title: "Unable to load question sets",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      })
      .finally(() => { if (isActive) setIsLoadingParents(false); });
    return () => { isActive = false; };
  }, [open, showToast]);

  if (!question) return null;

  const activeQuestion = question;

  function updateField<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toQuestionFormValues(activeQuestion));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateQuestionForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await questionsService.updateQuestion(activeQuestion.id, {
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
        title: "Question updated",
        description: "The question details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update question",
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
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Edit Question</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the question details and answer choices.
            </p>
          </div>
          <SecondaryButton className="rounded-xl" onClick={handleClose}>
            Close
          </SecondaryButton>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
          <QuestionForm
            disabled={isSubmitting || isLoadingParents}
            errors={errors}
            formId={formId}
            onChange={updateField}
            onSubmit={handleSubmit}
            questionSets={questionSets}
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
