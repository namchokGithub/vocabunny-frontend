import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
      />
    </svg>
  );
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[#1748ea] border border-[var(--primary)]",
  secondary:
    "border border-[var(--border-strong)] bg-white text-[var(--foreground)] hover:bg-slate-50",
  ghost:
    "border border-transparent bg-transparent text-slate-600 hover:bg-slate-100",
  danger:
    "border border-[var(--destructive)] bg-[var(--destructive)] text-white hover:bg-[var(--destructive-hover)]",
};

function Button({
  children,
  className,
  variant = "primary",
  isLoading,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function PrimaryButton(props: PropsWithChildren<ButtonProps>) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: PropsWithChildren<ButtonProps>) {
  return <Button variant="secondary" {...props} />;
}

export function GhostButton(props: PropsWithChildren<ButtonProps>) {
  return <Button variant="ghost" {...props} />;
}

export function DangerButton(props: PropsWithChildren<ButtonProps>) {
  return <Button variant="danger" {...props} />;
}
