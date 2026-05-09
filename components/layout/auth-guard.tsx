"use client";

import { AccessDenied } from "@/components/layout/access-denied";
import { hasRouteAccess } from "@/lib/constants/access";
import { useSession } from "@/lib/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";

interface AuthGuardProps {
  pathname: string;
}

export function AuthGuard({ children, pathname }: PropsWithChildren<AuthGuardProps>) {
  const router = useRouter();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return null;
  }

  if (!hasRouteAccess(session.role, pathname)) {
    return <AccessDenied role={session.role} />;
  }

  return <>{children}</>;
}
