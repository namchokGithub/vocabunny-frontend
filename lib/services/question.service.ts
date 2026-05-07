import { questionApi } from "@/lib/api/question";

export const questionService = {
  getQuestions: () => questionApi.getQuestions(),
};
