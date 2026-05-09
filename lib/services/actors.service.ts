import { actorsApi } from "@/lib/api/actors";
import type { Actor } from "@/types";
import {
  toPaginatedResult,
  type PaginatedResult,
  type PaginationParams,
} from "@/types/pagination";

export const actorsService = {
  async getActors(params?: PaginationParams): Promise<PaginatedResult<Actor>> {
    const items = await actorsApi.getActors();
    return toPaginatedResult(items, params);
  },
};
