"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  UnitForm,
  defaultUnitFormValues,
  normalizeUnitSlug,
  normalizeUnitTitle,
  validateUnitForm,
  type UnitFormErrors,
  type UnitFormValues,
} from "@/features/content/units/components/unit-form";
import type { Unit } from "@/lib/api/content/units";
import { unitsService } from "@/lib/services/content/units.service";

interface EditUnitDialogProps {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
  onUpdated?: () => void;
}

function toUnitFormValues(unit: Unit): UnitFormValues {
  return {
    title: unit.title,
    slug: unit.slug,
    description: unit.description ?? "",
    lessonId: unit.lesson_id,
    orderNo: String(unit.order_no),
    isPublished: unit.is_published,
  };
}

export function EditUnitDialog({ open, unit, onClose, onUpdated }: EditUnitDialogProps) {
  const formId = useId();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<UnitFormValues>(
    unit ? toUnitFormValues(unit) : defaultUnitFormValues,
  );
  const [errors, setErrors] = useState<UnitFormErrors>({});

  useEffect(() => {
    if (unit) {
      setValues(toUnitFormValues(unit));
      setErrors({});
    }
  }, [unit]);

  if (!unit) return null;

  const activeUnit = unit;

  function updateField<K extends keyof UnitFormValues>(key: K, value: UnitFormValues[K]) {
    if (key === "title") {
      setValues((current) => ({
        ...current,
        title: normalizeUnitTitle(String(value)),
      }));
      return;
    }
    if (key === "slug") {
      setValues((current) => ({
        ...current,
        slug: normalizeUnitSlug(String(value)),
      }));
      return;
    }
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(toUnitFormValues(activeUnit));
    setErrors({});
  }

  function handleClose() {
    if (isSubmitting) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateUnitForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await unitsService.updateUnit(activeUnit.id, {
        title: values.title.trim(),
        slug: values.slug.trim(),
        description: values.description.trim(),
        lesson_id: values.lessonId.trim(),
        order_no: Number(values.orderNo),
        is_published: values.isPublished,
      });

      showToast({
        title: "Unit updated",
        description: "The unit details were saved successfully.",
        variant: "success",
      });

      resetForm();
      onClose();
      onUpdated?.();
    } catch (error) {
      showToast({
        title: "Unable to update unit",
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
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Edit Unit</h2>
            <p className="mt-2 text-sm text-slate-500">
              Update the unit metadata and publishing state.
            </p>
          </div>
          <SecondaryButton className="rounded-xl" onClick={handleClose}>
            Close
          </SecondaryButton>
        </div>

        <div className="mt-6 rounded-[28px] border border-(--border) bg-slate-50/80 p-5">
          <UnitForm
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
