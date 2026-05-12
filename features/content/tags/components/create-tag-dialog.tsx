"use client";

import { useId, useState } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  TagForm,
  defaultTagFormValues,
  validateTagForm,
  type TagFormErrors,
  type TagFormValues,
} from "@/features/content/tags/components/tag-form";
import { tagsService } from "@/lib/services/content/tags.service";

interface CreateTagDialogProps {
  onCreated?: () => void;
}

export function CreateTagDialog({ onCreated }: CreateTagDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<TagFormValues>(defaultTagFormValues);
  const [errors, setErrors] = useState<TagFormErrors>({});

  function updateField<K extends keyof TagFormValues>(key: K, value: TagFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(defaultTagFormValues);
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateTagForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await tagsService.createTag({
        name: values.name.trim(),
        color: values.color.trim() || undefined,
      });

      showToast({
        title: "Tag created",
        description: "The new tag is now available.",
        variant: "success",
      });

      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (error) {
      showToast({
        title: "Unable to create tag",
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
      <PrimaryButton onClick={() => setOpen(true)}>Create Tag</PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                  Content Setup
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Create Tag</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add a vocabulary tag for filtering and curriculum organization.
                </p>
              </div>
              <SecondaryButton className="rounded-xl" onClick={handleClose}>
                Close
              </SecondaryButton>
            </div>

            <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
              <TagForm
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
                Create Tag
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
