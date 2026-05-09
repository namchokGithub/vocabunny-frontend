import { economyApi } from "@/lib/api/economy";
import type { CoinTransaction, Wallet } from "@/types";
import {
  toPaginatedResult,
  type PaginatedResult,
  type PaginationParams,
} from "@/types/pagination";

export const economyService = {
  async getWallets(params?: PaginationParams): Promise<PaginatedResult<Wallet>> {
    const items = await economyApi.getWallets();
    return toPaginatedResult(items, params);
  },
  async getTransactions(
    params?: PaginationParams,
  ): Promise<PaginatedResult<CoinTransaction>> {
    const items = await economyApi.getTransactions();
    return toPaginatedResult(items, params);
  },
};
