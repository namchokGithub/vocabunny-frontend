"use client";

import { AccessDenied } from "@/components/layout/access-denied";
import { SecondaryButton } from "@/components/ui/button";
import { hasRouteAccess } from "@/lib/constants/access";
import { useMockSession } from "@/lib/hooks/use-mock-session";
import Link from "next/link";
import type { PropsWithChildren } from "react";

interface AuthGuardProps {
  pathname: string;
}

export function AuthGuard({ children, pathname }: PropsWithChildren<AuthGuardProps>) {
  const { session, isLoading } = useMockSession();

  if (isLoading) {
    return (
      <div className="card rounded-[28px] p-8">
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="card rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
          Auth Guard
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950">Sign-in Required</h2>
        <p className="mt-3 text-sm text-slate-500">
          Dashboard routes are protected by a placeholder auth guard until real authentication is connected.
        </p>
        <div className="mt-6">
          <Link href="/login">
            <SecondaryButton>Go to Login</SecondaryButton>
          </Link>
        </div>
      </div>
    );
  }

  if (!hasRouteAccess(session.role, pathname)) {
    return <AccessDenied role={session.role} />;
  }

  return <>{children}</>;
}
