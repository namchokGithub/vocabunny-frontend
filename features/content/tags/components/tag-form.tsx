"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FormField, FormSection } from "@/components/form/form-field";

export interface TagFormValues {
  name: string;
  color: string;
}

export interface TagFormErrors {
  name?: string;
  color?: string;
}

interface TagFormProps {
  formId?: string;
  values: TagFormValues;
  errors: TagFormErrors;
  disabled?: boolean;
  onChange: <K extends keyof TagFormValues>(
    key: K,
    value: TagFormValues[K],
  ) => void;
  onSubmit?: React.ComponentProps<"form">["onSubmit"];
}

export const defaultTagFormValues: TagFormValues = {
  name: "",
  color: "",
};

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

export function validateTagForm(values: TagFormValues): TagFormErrors {
  const errors: TagFormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  const trimmedColor = values.color.trim();
  if (trimmedColor && !HEX_COLOR_RE.test(trimmedColor)) {
    errors.color = "Enter a valid HEX color (e.g. #60A5FA).";
  }
  return errors;
}

export function TagForm({
  formId,
  values,
  errors,
  disabled = false,
  onChange,
  onSubmit,
}: TagFormProps) {
  const colorInputId = React.useId();
  const trimmedColor = values.color.trim();
  const isValidColor = HEX_COLOR_RE.test(trimmedColor);
  const pickerValue = isValidColor ? trimmedColor : "#60A5FA";

  return (
    <form className="space-y-5" id={formId} onSubmit={onSubmit}>
      <FormSection>
        <FormField
          required
          disabled={disabled}
          error={errors.name}
          label="Name"
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Animals"
          value={values.name}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800">Color</span>
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-slate-50/80 px-3 py-3 transition focus-within:border-(--primary) focus-within:bg-white",
              errors.color ? "border-rose-300" : "border-(--border)",
              disabled && "opacity-70",
            )}
          >
            <label
              className={cn(
                "relative flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border bg-white shadow-xs transition",
                disabled && "cursor-not-allowed",
                errors.color ? "border-rose-200" : "border-slate-200",
              )}
              htmlFor={colorInputId}
            >
              <span
                className="absolute inset-0 bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0),linear-gradient(45deg,#e2e8f0_25%,transparent_25%,transparent_75%,#e2e8f0_75%,#e2e8f0)] bg-size-[12px_12px] bg-position-[0_0,6px_6px]"
                aria-hidden="true"
              />
              <span
                className="absolute inset-0.75 rounded-[10px] border border-black/5"
                style={{
                  backgroundColor: isValidColor ? trimmedColor : "transparent",
                }}
              />
              <input
                id={colorInputId}
                className="sr-only"
                disabled={disabled}
                type="color"
                value={pickerValue}
                onChange={(e) =>
                  onChange("color", e.target.value.toUpperCase())
                }
              />
            </label>
            <div className="flex flex-col gap-2">
              {/* Top: Color picker + Hex input */}
              <div className="flex items-center gap-2">
                <input
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-2.5 text-base tracking-[0.02em] text-slate-900 uppercase transition outline-none focus:border-(--primary)",
                    errors.color ? "border-rose-300" : "border-slate-200",
                  )}
                  disabled={disabled}
                  placeholder="#60A5FA"
                  value={values.color}
                  onChange={(e) => onChange("color", e.target.value)}
                />
              </div>

              {/* Bottom: Preview */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                <div
                  className="h-5 w-5 shrink-0 rounded-full border border-slate-200"
                  style={{
                    backgroundColor: isValidColor ? trimmedColor : "#e2e8f0",
                  }}
                />
                <div>
                  <div className="text-[10px] font-medium tracking-[0.14em] text-slate-400 uppercase">
                    Preview
                  </div>
                  <div className="truncate text-sm font-semibold text-slate-700">
                    {isValidColor ? trimmedColor.toUpperCase() : "No color"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {errors.color ? (
            <span className="text-xs text-rose-600">{errors.color}</span>
          ) : (
            <span className="text-xs text-slate-500">
              Optional. Pick a color or enter a HEX code manually.
            </span>
          )}
        </div>
      </FormSection>
    </form>
  );
}
