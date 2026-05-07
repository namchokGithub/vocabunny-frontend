import type { CreateQuestionSetPayload } from "@/types";
import { questionSetApi } from "@/lib/api/questionSet";

export const questionSetService = {
  getQuestionSets: () => questionSetApi.getQuestionSets(),
  createQuestionSet: (payload: CreateQuestionSetPayload) =>
    questionSetApi.createQuestionSet(payload),
};
