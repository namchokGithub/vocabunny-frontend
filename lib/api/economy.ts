import type { CoinTransaction, Wallet } from "@/types";
import { apiClient } from "./client";

const wallets: Wallet[] = [
  { id: "WLT-001", owner: "Lina M.", balance: 1400, tier: "plus", status: "healthy" },
  { id: "WLT-002", owner: "Noah R.", balance: 220, tier: "starter", status: "review" },
  { id: "WLT-003", owner: "Ava T.", balance: 4100, tier: "vip", status: "healthy" },
];

const transactions: CoinTransaction[] = [
  { id: "TX-001", walletOwner: "Lina M.", type: "earn", amount: 250, source: "Daily quest", createdAt: "2026-04-01 13:10" },
  { id: "TX-002", walletOwner: "Noah R.", type: "spend", amount: -150, source: "Shop purchase", createdAt: "2026-04-01 12:41" },
  { id: "TX-003", walletOwner: "Ava T.", type: "adjustment", amount: 500, source: "Ops correction", createdAt: "2026-04-01 10:15" },
];

export const economyApi = {
  getWallets: () => apiClient.mock(wallets),
  getTransactions: () => apiClient.mock(transactions),
};
