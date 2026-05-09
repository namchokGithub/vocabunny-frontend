"use client";

import { DangerButton, PrimaryButton, SecondaryButton } from "./button";

type ConfirmDialogVariant = "primary" | "danger";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  isSubmitting?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  onClose,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isSubmitting = false,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const handleClose = onClose ?? onCancel;
  const ConfirmButton = variant === "danger" ? DangerButton : PrimaryButton;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-md rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <SecondaryButton disabled={isSubmitting} onClick={handleClose}>
            {cancelLabel}
          </SecondaryButton>
          <ConfirmButton disabled={isSubmitting} onClick={onConfirm}>
            {isSubmitting ? "Working..." : confirmLabel}
          </ConfirmButton>
        </div>
      </div>
    </div>
  );
}
