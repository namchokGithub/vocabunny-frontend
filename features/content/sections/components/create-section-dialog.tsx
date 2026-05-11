"use client";

import { useEffect, useId, useState } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  SectionForm,
  defaultSectionFormValues,
  normalizeSectionSlug,
  normalizeSectionTitle,
  validateSectionForm,
  type SectionFormErrors,
  type SectionFormValues,
} from "@/features/content/sections/components/section-form";
import { contentOrderNosService } from "@/lib/services/content/order-nos.service";
import { sectionsService } from "@/lib/services/content/sections.service";

interface CreateSectionDialogProps {
  onCreated?: () => void;
}

export function CreateSectionDialog({ onCreated }: CreateSectionDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLastOrder, setIsLoadingLastOrder] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [values, setValues] = useState<SectionFormValues>(
    defaultSectionFormValues,
  );
  const [errors, setErrors] = useState<SectionFormErrors>({});

  function updateField<K extends keyof SectionFormValues>(
    key: K,
    value: SectionFormValues[K],
  ) {
    setValues((current) => {
      if (key === "title") {
        const nextTitle = normalizeSectionTitle(String(value));
        const nextValues = { ...current, title: nextTitle };

        if (!isSlugManuallyEdited) {
          nextValues.slug = normalizeSectionSlug(nextTitle);
        }

        return nextValues;
      }

      if (key === "slug") {
        const nextSlug = normalizeSectionSlug(String(value));
        setIsSlugManuallyEdited(nextSlug !== normalizeSectionSlug(current.title));
        return { ...current, slug: nextSlug };
      }

      return { ...current, [key]: value };
    });
  }

  function resetForm() {
    setValues(defaultSectionFormValues);
    setErrors({});
    setIsSlugManuallyEdited(false);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    let isActive = true;

    async function loadLastOrder() {
      setIsLoadingLastOrder(true);
      setErrors({});
      setIsSlugManuallyEdited(false);
      setValues(defaultSectionFormValues);

      try {
        const { sections } = await contentOrderNosService.getLastContentOrderNos();

        if (!isActive) {
          return;
        }

        setValues((current) => ({
          ...current,
          orderNo: String(sections || 1),
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        showToast({
          title: "Unable to load default order",
          description:
            error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      } finally {
        if (isActive) {
          setIsLoadingLastOrder(false);
        }
      }
    }

    void loadLastOrder();

    return () => {
      isActive = false;
    };
  }, [open, showToast]);

  function handleClose() {
    if (isSubmitting || isLoadingLastOrder) {
      return;
    }

    setOpen(false);
    resetForm();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateSectionForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await sectionsService.createSection({
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        order_no: Number(values.orderNo),
        is_published: values.isPublished,
      });

      showToast({
        title: "Section created",
        description: "The new section is now available in the content list.",
        variant: "success",
      });

      setOpen(false);
      resetForm();
      onCreated?.();
    } catch (error) {
      showToast({
        title: "Unable to create section",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
      setRefreshKey((current) => current + 1);
    }
  }

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>
        Create Section
      </PrimaryButton>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-2xl rounded-4xl p-6 shadow-2xl shadow-slate-950/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">
                  Content Setup
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Create Section
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Add a top-level section for organizing lessons and learner
                  progression.
                </p>
              </div>
              <SecondaryButton className="rounded-xl" onClick={handleClose}>
                Close
              </SecondaryButton>
            </div>

            <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
              <SectionForm
                disabled={isSubmitting || isLoadingLastOrder}
                errors={errors}
                formId={formId}
                onChange={updateField}
                onSubmit={handleSubmit}
                values={values}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <SecondaryButton
                disabled={isSubmitting || isLoadingLastOrder}
                onClick={handleClose}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                disabled={isLoadingLastOrder}
                isLoading={isSubmitting || isLoadingLastOrder}
                form={formId}
                type="submit"
              >
                Create Section
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
