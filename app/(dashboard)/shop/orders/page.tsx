"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { shopOrderColumns } from "@/components/operations/column-definitions";
import { shopService } from "@/lib/services/shop.service";

export default function ShopOrdersPage() {
  return (
    <ContentListPage
      columns={shopOrderColumns}
      createLabel="Create Order"
      description="Review purchase orders and fulfillment state for in-game goods."
      loader={shopService.getOrders}
      searchPlaceholder="Search orders..."
      title="Shop Orders"
    />
  );
}
