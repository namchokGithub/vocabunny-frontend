import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";

const BASE_PATH = "/api/v1/bo/content/question-choices";

export interface QuestionChoice {
  id: string;

  question_id: string;

  choice_text: string;

  choice_order: number;

  is_correct: boolean;

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;

  deleted_at?: string | null;
}

export interface GetQuestionChoicesParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  question_id?: string;

  is_correct?: boolean;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateQuestionChoicePayload {
  question_id: string;

  choice_text: string;

  choice_order?: number;

  is_correct?: boolean;
}

export interface UpdateQuestionChoicePayload {
  question_id?: string;

  choice_text?: string;

  choice_order?: number;

  is_correct?: boolean;
}

export interface DeleteQuestionChoiceResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/question-choices
 */
export async function getQuestionChoices(
  params?: GetQuestionChoicesParams,
): Promise<ApiResponse<QuestionChoice[]>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/question-choices/:id
 */
export async function getQuestionChoiceById(
  id: string,
): Promise<ApiResponse<QuestionChoice>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/question-choices
 */
export async function createQuestionChoice(
  payload: CreateQuestionChoicePayload,
): Promise<ApiResponse<QuestionChoice>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/question-choices/:id
 */
export async function updateQuestionChoice(
  id: string,
  payload: UpdateQuestionChoicePayload,
): Promise<ApiResponse<QuestionChoice>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/question-choices/:id
 */
export async function deleteQuestionChoice(
  id: string,
): Promise<ApiResponse<DeleteQuestionChoiceResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const questionChoicesApi = {
  getQuestionChoices,
  getQuestionChoiceById,
  createQuestionChoice,
  updateQuestionChoice,
  deleteQuestionChoice,
};
