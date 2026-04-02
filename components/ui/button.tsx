import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[#1748ea] border border-[var(--primary)]",
  secondary:
    "border border-[var(--border-strong)] bg-white text-[var(--foreground)] hover:bg-slate-50",
  ghost: "border border-transparent bg-transparent text-slate-600 hover:bg-slate-100",
};

function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
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
