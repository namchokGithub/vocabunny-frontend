"use client";

import { useEffect, useId, useState } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  TagForm,
  defaultTagFormValues,
  validateTagForm,
  type TagFormErrors,
  type TagFormValues,
} from "@/features/content/tags/components/tag-form";
import type { Tag } from "@/lib/api/content/tags";
import { tagsService } from "@/lib/services/content/tags.service";

interface EditTagDialogProps {
  open: boolean;
  tag: Tag | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toTagFormValues(tag: Tag): TagFormValues {
  return {
    name: tag.name,
    color: tag.color ?? "",
  };
}

export function EditTagDialog({ open, tag, onClose, onUpdated }: EditTagDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<TagFormValues>(
    tag ? toTagFormValues(tag) : defaultTagFormValues,
  );
  const [errors, setErrors] = useState<TagFormErrors>({});

  useEffect(() => {
    if (tag) {
      setValues(toTagFormValues(tag));
      setErrors({});
    }
  }, [tag]);

  if (!tag) return null;

  const activeTag = tag;

  function updateField<K extends keyof TagFormValues>(key: K, value: TagFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toTagFormValues(activeTag));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateTagForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await tagsService.updateTag(activeTag.id, {
        name: values.name.trim(),
        color: values.color.trim() || undefined,
      });

      showToast({
        title: "Tag updated",
        description: "The tag details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update tag",
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
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Edit Tag</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the tag name and color.
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
            Save Changes
          </PrimaryButton>
        </div>
      </div>
    </div>
  ) : null;
}
