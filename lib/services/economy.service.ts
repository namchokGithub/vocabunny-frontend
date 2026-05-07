import { economyApi } from "@/lib/api/economy";

export const economyService = {
  getWallets: () => economyApi.getWallets(),
  getTransactions: () => economyApi.getTransactions(),
};
