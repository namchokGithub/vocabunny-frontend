"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { shopItemColumns } from "@/components/operations/column-definitions";
import { shopApi } from "@/lib/api";

export default function ShopItemsPage() {
  return (
    <ContentListPage
      columns={shopItemColumns}
      createLabel="Create Item"
      description="Manage the in-game item catalog, pricing, and stock visibility."
      loader={shopApi.getItems}
      searchPlaceholder="Search shop items..."
      title="Shop Items"
    />
  );
}
