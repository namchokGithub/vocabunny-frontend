import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";
import type { QueryParams } from "@/types/http";
import type { PaginatedResult } from "@/types/pagination";

const BASE_PATH = "/api/v1/bo/content/lessons";

export interface Lesson {
  id: string;

  section_id: string;

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

export interface GetLessonsParams extends QueryParams {
  page?: number;
  limit?: number;

  search?: string;

  section_id?: string;

  is_published?: boolean;

  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface CreateLessonPayload {
  section_id: string;

  slug: string;

  title: string;

  description?: string;

  order_no?: number;

  is_published?: boolean;
}

export interface UpdateLessonPayload {
  section_id?: string;

  slug?: string;

  title?: string;

  description?: string;

  order_no?: number;

  is_published?: boolean;
}

export interface DeleteLessonResponse {
  id: string;

  status: "deleted";
}

/**
 * GET /bo/content/lessons
 */
export async function getLessons(
  params?: GetLessonsParams,
): Promise<ApiResponse<PaginatedResult<Lesson>>> {
  return apiClient.get(BASE_PATH, params);
}

/**
 * GET /bo/content/lessons/:id
 */
export async function getLessonById(id: string): Promise<ApiResponse<Lesson>> {
  return apiClient.get(`${BASE_PATH}/${id}`);
}

/**
 * POST /bo/content/lessons
 */
export async function createLesson(
  payload: CreateLessonPayload,
): Promise<ApiResponse<Lesson>> {
  return apiClient.post(BASE_PATH, {
    body: payload,
  });
}

/**
 * PUT /bo/content/lessons/:id
 */
export async function updateLesson(
  id: string,
  payload: UpdateLessonPayload,
): Promise<ApiResponse<Lesson>> {
  return apiClient.put(`${BASE_PATH}/${id}`, {
    body: payload,
  });
}

/**
 * DELETE /bo/content/lessons/:id
 */
export async function deleteLesson(
  id: string,
): Promise<ApiResponse<DeleteLessonResponse>> {
  return apiClient.delete(`${BASE_PATH}/${id}`);
}

export const lessonsApi = {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
