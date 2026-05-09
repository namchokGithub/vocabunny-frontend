import { shopApi } from "@/lib/api/shop";
import type { ShopItem, ShopOrder } from "@/types";
import {
  toPaginatedResult,
  type PaginatedResult,
  type PaginationParams,
} from "@/types/pagination";

export const shopService = {
  async getItems(params?: PaginationParams): Promise<PaginatedResult<ShopItem>> {
    const items = await shopApi.getItems();
    return toPaginatedResult(items, params);
  },
  async getOrders(params?: PaginationParams): Promise<PaginatedResult<ShopOrder>> {
    const items = await shopApi.getOrders();
    return toPaginatedResult(items, params);
  },
};
