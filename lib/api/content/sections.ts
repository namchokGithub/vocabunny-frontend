import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";

const BASE_PATH = "/api/v1/bo/content/sections";

export interface Section {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order_no: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface GetSectionsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;
  is_published?: boolean;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateSectionPayload {
  slug: string;
  title: string;
  description?: string;
  order_no?: number;
  is_published?: boolean;
}

export interface UpdateSectionPayload {
  slug?: string;
  title?: string;
  description?: string;
  order_no?: number;
  is_published?: boolean;
}

export interface DeleteSectionResponse {
  id: string;
  status: "deleted";
}

/**
 * GET /bo/content/sections
 */
export async function getSections(
  params?: GetSectionsParams,
): Promise<ApiResponse<Section[]>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/sections/:id
 */
export async function getSectionById(
  id: string,
): Promise<ApiResponse<Section>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/sections
 */
export async function createSection(
  payload: CreateSectionPayload,
): Promise<ApiResponse<Section>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/sections/:id
 */
export async function updateSection(
  id: string,
  payload: UpdateSectionPayload,
): Promise<ApiResponse<Section>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/sections/:id
 */
export async function deleteSection(
  id: string,
): Promise<ApiResponse<DeleteSectionResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}
