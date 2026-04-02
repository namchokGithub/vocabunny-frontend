"use client";

import { iconMap } from "@/components/layout/icon-map";
import { GhostButton } from "@/components/ui/button";
import { sidebarNavigation } from "@/lib/constants/navigation";
import { useMockSession } from "@/lib/hooks/use-mock-session";
import { isRouteActive } from "@/lib/utils/routes";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { session } = useMockSession();
  const visibleNavigation = session
    ? sidebarNavigation.filter((item) => item.allowedRoles?.includes(session.role))
    : [];

  return (
    <aside
      className={cn(
        "card sticky top-4 hidden h-[calc(100vh-2rem)] flex-col rounded-[28px] border p-4 lg:flex",
        collapsed ? "w-[92px]" : "w-[280px]",
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className={cn("overflow-hidden", collapsed && "hidden")}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            VocabBunny BO
          </p>
          <h1 className="mt-1 text-lg font-bold text-slate-900">Admin Console</h1>
        </div>
        <GhostButton className="h-10 w-10 rounded-xl p-0" onClick={onToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </GhostButton>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            isRouteActive(pathname, item.href) ||
            item.children?.some((child) => isRouteActive(pathname, child.href));

          return (
            <div key={item.title} className="space-y-1">
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100",
                )}
                href={item.href}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span>{item.title}</span> : null}
              </Link>

              {!collapsed && item.children ? (
                <div className="ml-5 space-y-1 border-l border-[var(--border)] pl-4">
                  {item.children.map((child) => {
                    const childActive = isRouteActive(pathname, child.href);
                    return (
                      <Link
                        key={child.href}
                        className={cn(
                          "block rounded-xl px-3 py-2 text-sm transition",
                          childActive
                            ? "bg-blue-50 font-semibold text-[var(--primary)]"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                        )}
                        href={child.href}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            Active Role
          </p>
          <p className="mt-2 text-sm font-semibold text-blue-900">
            {session ? session.role.replaceAll("_", " ") : "Signed out"}
          </p>
          <p className="mt-2 text-sm text-blue-900">
            {session
              ? "Mock session is enabled. Replace it later with real auth and permission data."
              : "No active session. Dashboard routes will be blocked until sign-in succeeds."}
          </p>
        </div>
      ) : null}
    </aside>
  );
}
