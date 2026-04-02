import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, PropsWithChildren, TextareaHTMLAttributes } from "react";

interface BaseFieldProps {
  label: string;
  hint?: string;
  className?: string;
  error?: string;
}

type InputProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormField({ label, hint, className, error, ...props }: InputProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        className={cn(
          "rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]",
          error ? "border-rose-300" : "border-[var(--border)]",
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function TextareaField({ label, hint, className, error, ...props }: TextareaProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        className={cn(
          "min-h-28 rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)]",
          error ? "border-rose-300" : "border-[var(--border)]",
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function FormSection({ children }: PropsWithChildren) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}
