import type { QuestDefinition } from "@/types";
import { apiClient } from "./client";

const quests: QuestDefinition[] = [
  { id: "QST-001", title: "Finish 3 lessons", rewardCoins: 120, frequency: "daily", status: "active" },
  { id: "QST-002", title: "Win a boss battle", rewardCoins: 350, frequency: "weekly", status: "paused" },
  { id: "QST-003", title: "Summer event combo", rewardCoins: 500, frequency: "event", status: "draft" },
];

export const questsApi = {
  getQuestDefinitions: () => apiClient.mock(quests),
};
