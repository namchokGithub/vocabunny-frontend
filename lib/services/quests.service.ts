import { questsApi } from "@/lib/api/quests";

export const questsService = {
  getQuestDefinitions: () => questsApi.getQuestDefinitions(),
};
