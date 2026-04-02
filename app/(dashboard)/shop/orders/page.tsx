"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { shopOrderColumns } from "@/components/operations/column-definitions";
import { shopApi } from "@/lib/api";

export default function ShopOrdersPage() {
  return (
    <ContentListPage
      columns={shopOrderColumns}
      createLabel="Create Order"
      description="Review purchase orders and fulfillment state for in-game goods."
      loader={shopApi.getOrders}
      searchPlaceholder="Search orders..."
      title="Shop Orders"
    />
  );
}
