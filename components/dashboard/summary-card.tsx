import { formatNumber } from "@/lib/utils";
import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
}

export function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <div className="card rounded-[28px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-2xl bg-blue-50 p-3 text-[var(--primary)]">{icon}</div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(value)}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
