"use client";

import { getMockStaffSession } from "@/lib/constants/auth";

export function useMockSession() {
  return {
    session: getMockStaffSession(),
    isLoading: false,
  };
}
