import type { ShopItem, ShopOrder } from "@/types";
import { apiClient } from "./client";

const items: ShopItem[] = [
  { id: "ITM-001", name: "Double XP Ticket", price: 150, category: "booster", stockStatus: "in_stock" },
  { id: "ITM-002", name: "Moonlight Bunny Skin", price: 900, category: "cosmetic", stockStatus: "limited" },
  { id: "ITM-003", name: "Starter Treasure Box", price: 450, category: "bundle", stockStatus: "in_stock" },
];

const orders: ShopOrder[] = [
  { id: "ORD-001", orderNo: "VB-3001", itemName: "Double XP Ticket", buyer: "Lina M.", amount: 150, status: "paid" },
  { id: "ORD-002", orderNo: "VB-3002", itemName: "Moonlight Bunny Skin", buyer: "Noah R.", amount: 900, status: "pending" },
  { id: "ORD-003", orderNo: "VB-3003", itemName: "Starter Treasure Box", buyer: "Ava T.", amount: 450, status: "fulfilled" },
];

export const shopApi = {
  getItems: () => apiClient.mock(items),
  getOrders: () => apiClient.mock(orders),
};
