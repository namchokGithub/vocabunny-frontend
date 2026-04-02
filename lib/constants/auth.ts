import { env } from "@/lib/constants/env";
import type { StaffSession } from "@/types";

export const mockStaffSession: StaffSession = {
  id: "staff-001",
  name: "Ariya Ops",
  email: "ariya.ops@vocabunny.co",
  role: "admin",
};

export function getMockStaffSession() {
  if (!env.enableMockAuth) {
    return null;
  }

  return mockStaffSession;
}
