import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";
import type { PaginatedResult } from "@/types/pagination";

const BASE_PATH = "/api/v1/bo/content/tags";

export interface Tag {
  id: string;

  name: string;

  color?: string | null;

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;
}

export interface GetTagsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateTagPayload {
  name: string;
  color?: string;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string;
}

export interface DeleteTagResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/tags
 */
export async function getTags(
  params?: GetTagsParams,
): Promise<ApiResponse<PaginatedResult<Tag>>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/tags/:id
 */
export async function getTagById(id: string): Promise<ApiResponse<Tag>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/tags
 */
export async function createTag(
  payload: CreateTagPayload,
): Promise<ApiResponse<Tag>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/tags/:id
 */
export async function updateTag(
  id: string,
  payload: UpdateTagPayload,
): Promise<ApiResponse<Tag>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/tags/:id
 */
export async function deleteTag(
  id: string,
): Promise<ApiResponse<DeleteTagResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const tagsApi = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
