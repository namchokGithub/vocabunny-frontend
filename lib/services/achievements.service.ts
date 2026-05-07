import { achievementsApi } from "@/lib/api/achievements";

export const achievementsService = {
  getTrophyTiers: () => achievementsApi.getTrophyTiers(),
};
