import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";
import type { PaginatedResult } from "@/types/pagination";

const BASE_PATH = "/api/v1/bo/content/question-sets";

export interface QuestionSet {
  id: string;

  unit_id: string;

  slug: string;

  title: string;

  description: string | null;

  order_no: number;

  estimated_seconds?: number | null;

  version: number;

  is_published: boolean;

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;

  deleted_at?: string | null;
}

export interface GetQuestionSetsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  unit_id?: string;

  version?: number;

  is_published?: boolean;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateQuestionSetPayload {
  unit_id: string;

  slug: string;

  title: string;

  description?: string;

  order_no?: number;

  estimated_seconds?: number;

  version?: number;

  is_published?: boolean;
}

export interface UpdateQuestionSetPayload {
  unit_id?: string;

  slug?: string;

  title?: string;

  description?: string;

  order_no?: number;

  estimated_seconds?: number;

  version?: number;

  is_published?: boolean;
}

export interface DeleteQuestionSetResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/question-sets
 */
export async function getQuestionSets(
  params?: GetQuestionSetsParams,
): Promise<ApiResponse<PaginatedResult<QuestionSet>>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/question-sets/:id
 */
export async function getQuestionSetById(
  id: string,
): Promise<ApiResponse<QuestionSet>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/question-sets
 */
export async function createQuestionSet(
  payload: CreateQuestionSetPayload,
): Promise<ApiResponse<QuestionSet>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/question-sets/:id
 */
export async function updateQuestionSet(
  id: string,
  payload: UpdateQuestionSetPayload,
): Promise<ApiResponse<QuestionSet>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/question-sets/:id
 */
export async function deleteQuestionSet(
  id: string,
): Promise<ApiResponse<DeleteQuestionSetResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const questionSetsApi = {
  getQuestionSets,
  getQuestionSetById,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
};
