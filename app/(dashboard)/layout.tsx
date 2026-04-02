"use client";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageContainer } from "@/components/layout/page-container";
import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen p-4 lg:p-5">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
        <main className="min-w-0 flex-1">
          <AppHeader />
          <PageContainer>
            <AuthGuard pathname={pathname}>{children}</AuthGuard>
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
