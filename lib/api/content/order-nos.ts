import { apiClient } from "@/lib/api/client";

import type { ApiResponse } from "@/types/api";

const BASE_PATH = "/api/v1/bo/content/order-nos";

export interface ContentOrderNosLastResponse {
  sections: number;
  lessons: number;
  units: number;
  question_sets: number;
  questions: number;
}

/**
 * GET /bo/content/order-nos/last
 */
export async function getLastContentOrderNos(): Promise<
  ApiResponse<ContentOrderNosLastResponse>
> {
  return apiClient.get(`${BASE_PATH}/last`);
}

export const contentOrderNosApi = {
  getLastContentOrderNos,
};
