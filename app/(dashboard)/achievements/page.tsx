"use client";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { achievementsApi } from "@/lib/api";
import { useAsyncData } from "@/lib/hooks/use-async-data";

export default function AchievementsPage() {
  const { data } = useAsyncData(achievementsApi.getTrophyTiers);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track trophy tiers, unlock pacing, and monthly achievement performance."
        title="Achievements"
      />

      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {data?.map((tier) => (
          <div key={tier.id} className="card rounded-[28px] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{tier.name}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{tier.unlocks}</h3>
              </div>
              <StatusBadge value={tier.tier} />
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Monthly progress</span>
                <span>{tier.progress}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-[var(--primary)]"
                  style={{ width: `${tier.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="card rounded-[28px] p-6">
        <h3 className="text-lg font-semibold text-slate-950">Monthly Progress Placeholder</h3>
        <div className="mt-5 h-72 rounded-[24px] bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-6">
          <div className="grid h-full grid-cols-12 items-end gap-3">
            {[28, 42, 36, 51, 49, 62, 58, 65, 71, 69, 78, 82].map((height, index) => (
              <div
                key={index}
                className="rounded-t-xl bg-white/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
