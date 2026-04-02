import { SecondaryButton } from "@/components/ui/button";
import type { StaffRole } from "@/types";
import Link from "next/link";

interface AccessDeniedProps {
  role: StaffRole;
  title?: string;
  description?: string;
}

export function AccessDenied({
  role,
  title = "Access Restricted",
  description = "Your current staff role does not have permission to open this section.",
}: AccessDeniedProps) {
  return (
    <div className="card rounded-[28px] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
        Permission Check
      </p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-500">{description}</p>
      <p className="mt-4 text-sm text-slate-700">
        Active role: <span className="font-semibold capitalize">{role.replaceAll("_", " ")}</span>
      </p>
      <div className="mt-6">
        <Link href="/dashboard">
          <SecondaryButton>Back to Dashboard</SecondaryButton>
        </Link>
      </div>
    </div>
  );
}
