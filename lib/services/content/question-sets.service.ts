import {
  questionSetsApi,
  type CreateQuestionSetPayload,
  type GetQuestionSetsParams,
  type QuestionSet,
  type UpdateQuestionSetPayload,
} from "@/lib/api/content/question-sets";

export const questionSetsService = {
  async getQuestionSets(
    params?: GetQuestionSetsParams,
  ): Promise<QuestionSet[]> {
    const response = await questionSetsApi.getQuestionSets(params);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async getQuestionSetById(id: string): Promise<QuestionSet> {
    const response = await questionSetsApi.getQuestionSetById(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async createQuestionSet(
    payload: CreateQuestionSetPayload,
  ): Promise<QuestionSet> {
    const response = await questionSetsApi.createQuestionSet(payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async updateQuestionSet(
    id: string,
    payload: UpdateQuestionSetPayload,
  ): Promise<QuestionSet> {
    const response = await questionSetsApi.updateQuestionSet(id, payload);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },

  async deleteQuestionSet(id: string) {
    const response = await questionSetsApi.deleteQuestionSet(id);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
