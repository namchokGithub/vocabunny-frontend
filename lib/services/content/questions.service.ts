import {
  questionsApi,
  type CreateQuestionPayload,
  type GetQuestionsParams,
  type Question,
  type UpdateQuestionPayload,
} from "@/lib/api/content/questions";
import type { PaginatedResult } from "@/types/pagination";

export const questionsService = {
  async getQuestions(params?: GetQuestionsParams): Promise<PaginatedResult<Question>> {
    const response = await questionsApi.getQuestions(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await questionsApi.getQuestionById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createQuestion(payload: CreateQuestionPayload): Promise<Question> {
    const response = await questionsApi.createQuestion(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateQuestion(
    id: string,
    payload: UpdateQuestionPayload,
  ): Promise<Question> {
    const response = await questionsApi.updateQuestion(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteQuestion(id: string) {
    const response = await questionsApi.deleteQuestion(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
