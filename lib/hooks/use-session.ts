"use client";

import { useEffect, useState } from "react";
import { AUTH_STATE_EVENT, getSession, restoreSession } from "@/lib/auth/auth";
import type { StaffSession } from "@/types";

export function useSession(): { session: StaffSession | null; isLoading: boolean } {
  const [session, setSession] = useState<StaffSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function syncSession() {
      setIsLoading(true);
      const nextSession = await restoreSession();

      if (active) {
        setSession(nextSession);
        setIsLoading(false);
      }
    }

    void syncSession();

    const handleStorage = (event: StorageEvent) => {
      if (event.key && !event.key.startsWith("vb_")) {
        return;
      }

      if (active) {
        setSession(getSession());
        setIsLoading(false);
      }
    };

    const handleAuthChange = () => {
      if (active) {
        setSession(getSession());
        setIsLoading(false);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_STATE_EVENT, handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_STATE_EVENT, handleAuthChange);
    };
  }, []);

  return { session, isLoading };
}
