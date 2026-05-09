import { Breadcrumbs } from "./breadcrumbs";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 rounded-[28px] border border-(--border) bg-white/90 p-6 shadow-(--shadow) lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Breadcrumbs />
        <h2 className="mt-3 text-3xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}
