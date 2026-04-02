import type { TrophyTier } from "@/types";
import { apiClient } from "./client";

const trophies: TrophyTier[] = [
  { id: "TR-001", name: "Word Scout", tier: "bronze", unlocks: 1200, progress: 62 },
  { id: "TR-002", name: "Combo Hunter", tier: "silver", unlocks: 860, progress: 48 },
  { id: "TR-003", name: "Arena Master", tier: "gold", unlocks: 340, progress: 21 },
  { id: "TR-004", name: "Legend Keeper", tier: "platinum", unlocks: 72, progress: 9 },
];

export const achievementsApi = {
  getTrophyTiers: () => apiClient.mock(trophies),
};
