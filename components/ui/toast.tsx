"use client";

import { CheckCircle2, CircleAlert, TriangleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { GhostButton } from "@/components/ui/button";

type ToastVariant = "success" | "error" | "warning";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-white text-slate-900",
  error: "border-rose-200 bg-white text-slate-900",
  warning: "border-amber-200 bg-white text-slate-900",
};

const toastIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <CircleAlert className="h-5 w-5 text-rose-500" />,
  warning: <TriangleAlert className="h-5 w-5 text-amber-500" />,
};

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, variant }: Omit<ToastItem, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);

      setToasts((current) => [...current, { id, title, description, variant }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 3000);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-70 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl shadow-slate-900/10 ${toastStyles[toast.variant]}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{toastIcons[toast.variant]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <GhostButton
                aria-label="Dismiss notification"
                className="h-8 w-8 shrink-0 rounded-xl p-0"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </GhostButton>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
