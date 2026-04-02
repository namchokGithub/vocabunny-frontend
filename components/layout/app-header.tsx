"use client";

import { GhostButton, PrimaryButton } from "@/components/ui/button";
import { useMockSession } from "@/lib/hooks/use-mock-session";
import { Bell, Menu, Search } from "lucide-react";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { session } = useMockSession();

  return (
    <header className="card mb-6 flex items-center justify-between rounded-[28px] px-5 py-4">
      <div className="flex items-center gap-3">
        <GhostButton className="h-10 w-10 rounded-xl p-0 lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </GhostButton>
        <div className="hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-56 border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search modules, records, staff..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-[var(--border)] bg-slate-50 px-3 py-2 text-right md:block">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
            {session ? session.role.replaceAll("_", " ") : "guest"}
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {session ? session.name : "No active session"}
          </p>
        </div>
        <GhostButton className="h-10 w-10 rounded-xl p-0">
          <Bell className="h-5 w-5" />
        </GhostButton>
        <PrimaryButton>New Entry</PrimaryButton>
      </div>
    </header>
  );
}
