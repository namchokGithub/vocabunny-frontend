import type { ActivityItem, AnalyticsSummary } from "@/types";
import { apiClient } from "./client";

const summary: AnalyticsSummary = {
  dau: 18240,
  lessonsStarted: 6290,
  lessonsCompleted: 4138,
  revenueCoins: 284000,
  retentionRate: 43.2,
};

const recentActivity: ActivityItem[] = [
  { id: "ACT-001", title: "Question set published", description: "Ops published 'Greetings Quick Quiz' to production.", time: "12 minutes ago" },
  { id: "ACT-002", title: "Quest paused", description: "Quest 'Win a boss battle' was paused by Economy Ops.", time: "45 minutes ago" },
  { id: "ACT-003", title: "Wallet review triggered", description: "1 wallet entered manual review due to abnormal spend rate.", time: "1 hour ago" },
];

export const analyticsApi = {
  getSummary: () => apiClient.mock(summary),
  getRecentActivity: () => apiClient.mock(recentActivity),
};
