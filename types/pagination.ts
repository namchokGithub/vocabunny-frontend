import type { QueryParams } from "@/types/http";

export interface PagingInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  paging: PagingInfo;
  query?: QueryParams;
}

export interface PaginationParams extends QueryParams {
  page?: number;
  limit?: number;
}

export function toPaginatedResult<T>(
  items: T[],
  params?: PaginationParams,
): PaginatedResult<T> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? (items.length || 1);
  const total = items.length;
  const total_pages = total === 0 ? 1 : Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const pagedItems = items.slice(start, start + limit);

  return {
    items: pagedItems,
    paging: {
      page,
      limit,
      total,
      total_pages,
    },
    query: params,
  };
}
