import { contentApi } from "@/lib/api/content/content";

export const contentService = {
  getSections: () => contentApi.getSections(),
  getLessons: () => contentApi.getLessons(),
  getUnits: () => contentApi.getUnits(),
};
