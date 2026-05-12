import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";
import type { PaginatedResult } from "@/types/pagination";

const BASE_PATH = "/api/v1/bo/content/units";

export interface LessonSummary {
  id: string;
  section_id: string;
  slug: string;
  title: string;
}

export interface Unit {
  id: string;

  lesson_id: string;
  lesson?: LessonSummary;

  slug: string;

  title: string;

  description: string | null;

  order_no: number;

  is_published: boolean;

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;

  deleted_at?: string | null;
}

export interface GetUnitsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  lesson_id?: string;

  is_published?: boolean;

  include?: string;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateUnitPayload {
  lesson_id: string;

  slug: string;

  title: string;

  description?: string;

  order_no?: number;

  is_published?: boolean;
}

export interface UpdateUnitPayload {
  lesson_id?: string;

  slug?: string;

  title?: string;

  description?: string;

  order_no?: number;

  is_published?: boolean;
}

export interface DeleteUnitResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/units
 */
export async function getUnits(
  params?: GetUnitsParams,
): Promise<ApiResponse<PaginatedResult<Unit>>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/units/:id
 */
export async function getUnitById(id: string): Promise<ApiResponse<Unit>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/units
 */
export async function createUnit(
  payload: CreateUnitPayload,
): Promise<ApiResponse<Unit>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/units/:id
 */
export async function updateUnit(
  id: string,
  payload: UpdateUnitPayload,
): Promise<ApiResponse<Unit>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/units/:id
 */
export async function deleteUnit(
  id: string,
): Promise<ApiResponse<DeleteUnitResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const unitsApi = {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};
