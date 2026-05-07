import { analyticsApi } from "@/lib/api/analytics";

export const analyticsService = {
  getSummary: () => analyticsApi.getSummary(),
  getRecentActivity: () => analyticsApi.getRecentActivity(),
};
