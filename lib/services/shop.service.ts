import { shopApi } from "@/lib/api/shop";

export const shopService = {
  getItems: () => shopApi.getItems(),
  getOrders: () => shopApi.getOrders(),
};
