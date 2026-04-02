import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  value: string;
}

const colorMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  paused: "bg-orange-50 text-orange-700 border-orange-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-sky-50 text-sky-700 border-sky-200",
  fulfilled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
  limited: "bg-amber-50 text-amber-700 border-amber-200",
  out_of_stock: "bg-rose-50 text-rose-700 border-rose-200",
  guest: "bg-slate-100 text-slate-700 border-slate-200",
  user: "bg-indigo-50 text-indigo-700 border-indigo-200",
  online: "bg-emerald-50 text-emerald-700 border-emerald-200",
  offline: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  frozen: "bg-sky-50 text-sky-700 border-sky-200",
  bronze: "bg-orange-50 text-orange-700 border-orange-200",
  silver: "bg-slate-100 text-slate-700 border-slate-200",
  gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
  platinum: "bg-violet-50 text-violet-700 border-violet-200",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        colorMap[value] ?? "border-slate-200 bg-slate-100 text-slate-700",
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
