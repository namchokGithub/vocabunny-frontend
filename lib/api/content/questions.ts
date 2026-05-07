import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";

const BASE_PATH = "/api/v1/bo/content/questions";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "FILL_IN_THE_BLANK"
  | "DRAG_DROP"
  | "REORDER"
  | "TYPING";

export interface QuestionChoice {
  choice_text: string;

  choice_order: number;

  is_correct: boolean;
}

export interface Question {
  id: string;

  question_set_id: string;

  type: QuestionType;

  question_text: string;

  blank_position?: number | null;

  explanation?: string | null;

  image_url?: string | null;

  difficulty: number;

  order_no: number;

  is_active: boolean;

  choices?: QuestionChoice[];

  tag_ids?: string[];

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;

  deleted_at?: string | null;
}

export interface GetQuestionsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  question_set_id?: string;

  type?: QuestionType;

  is_active?: boolean;

  include_choices?: boolean;

  include_tags?: boolean;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateQuestionPayload {
  question_set_id: string;

  type: QuestionType;

  question_text: string;

  blank_position?: number;

  explanation?: string;

  image_url?: string;

  difficulty?: number;

  order_no?: number;

  is_active?: boolean;

  choices?: QuestionChoice[];

  tag_ids?: string[];
}

export interface UpdateQuestionPayload {
  question_set_id?: string;

  type?: QuestionType;

  question_text?: string;

  blank_position?: number;

  explanation?: string;

  image_url?: string;

  difficulty?: number;

  order_no?: number;

  is_active?: boolean;

  choices?: QuestionChoice[];

  tag_ids?: string[];
}

export interface DeleteQuestionResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/questions
 */
export async function getQuestions(
  params?: GetQuestionsParams,
): Promise<ApiResponse<Question[]>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/questions/:id
 */
export async function getQuestionById(
  id: string,
): Promise<ApiResponse<Question>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/questions
 */
export async function createQuestion(
  payload: CreateQuestionPayload,
): Promise<ApiResponse<Question>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/questions/:id
 */
export async function updateQuestion(
  id: string,
  payload: UpdateQuestionPayload,
): Promise<ApiResponse<Question>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/questions/:id
 */
export async function deleteQuestion(
  id: string,
): Promise<ApiResponse<DeleteQuestionResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const questionsApi = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
