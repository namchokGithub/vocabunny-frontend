"use client";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { LoadingTable } from "@/components/table/loading-table";
import { SecondaryButton } from "@/components/ui/button";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { analyticsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, BookCopy, Coins, Users } from "lucide-react";
import Link from "next/link";

export function DashboardOverview() {
  const summary = useAsyncData(analyticsApi.getSummary);
  const activity = useAsyncData(analyticsApi.getRecentActivity);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <SummaryCard
          description="Daily active learners across all regions."
          icon={<Users className="h-6 w-6" />}
          title="Daily Active Users"
          value={summary.data?.dau ?? 0}
        />
        <SummaryCard
          description="Lesson starts recorded in the last 24 hours."
          icon={<BookCopy className="h-6 w-6" />}
          title="Lessons Started"
          value={summary.data?.lessonsStarted ?? 0}
        />
        <SummaryCard
          description="Completed lessons synced to analytics pipeline."
          icon={<BarChart3 className="h-6 w-6" />}
          title="Lessons Completed"
          value={summary.data?.lessonsCompleted ?? 0}
        />
        <div className="card rounded-[28px] p-5">
          <div className="mb-5 rounded-2xl bg-blue-50 p-3 text-[var(--primary)]">
            <Coins className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-500">Coin Revenue</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatCurrency(summary.data?.revenueCoins ?? 0)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Retention: {summary.data?.retentionRate ?? 0}% seven-day retention.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card rounded-[28px] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Recent Activity</h3>
              <p className="text-sm text-slate-500">Operator and system events from the last hour.</p>
            </div>
            <SecondaryButton>View logs</SecondaryButton>
          </div>

          {activity.isLoading ? (
            <LoadingTable />
          ) : (
            <div className="space-y-4">
              {activity.data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--border)] bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-slate-950">Quick Access</h3>
            <div className="mt-4 grid gap-3">
              <Link className="rounded-2xl border border-[var(--border)] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/content/question-sets/create">
                Create Question Set
              </Link>
              <Link className="rounded-2xl border border-[var(--border)] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/quests">
                Manage Quest Definitions
              </Link>
              <Link className="rounded-2xl border border-[var(--border)] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/analytics">
                Open Analytics Module
              </Link>
            </div>
          </div>

          <div className="card rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-slate-950">Engagement Snapshot</h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Chart Placeholder</p>
                <div className="mt-4 h-32 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-300 opacity-80" />
              </div>
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm font-medium text-slate-500">Top Event</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">Lesson completion streak improved 18%</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
