import {
  questionChoicesApi,
  type CreateQuestionChoicePayload,
  type GetQuestionChoicesParams,
  type QuestionChoice,
  type UpdateQuestionChoicePayload,
} from "@/lib/api/content/question-choices";
import type { PaginatedResult } from "@/types/pagination";

export const questionChoicesService = {
  async getQuestionChoices(
    params?: GetQuestionChoicesParams,
  ): Promise<PaginatedResult<QuestionChoice>> {
    const response = await questionChoicesApi.getQuestionChoices(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getQuestionChoiceById(id: string): Promise<QuestionChoice> {
    const response = await questionChoicesApi.getQuestionChoiceById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createQuestionChoice(
    payload: CreateQuestionChoicePayload,
  ): Promise<QuestionChoice> {
    const response = await questionChoicesApi.createQuestionChoice(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateQuestionChoice(
    id: string,
    payload: UpdateQuestionChoicePayload,
  ): Promise<QuestionChoice> {
    const response = await questionChoicesApi.updateQuestionChoice(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteQuestionChoice(id: string) {
    const response = await questionChoicesApi.deleteQuestionChoice(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
