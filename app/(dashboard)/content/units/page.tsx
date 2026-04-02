"use client";

import { unitColumns } from "@/components/content/column-definitions";
import { ContentListPage } from "@/components/content/content-list-page";
import { contentApi } from "@/lib/api";

export default function UnitsPage() {
  return (
    <ContentListPage
      columns={unitColumns}
      createLabel="Create Unit"
      description="Manage units and vocabulary volume inside each lesson."
      loader={contentApi.getUnits}
      searchPlaceholder="Search units..."
      title="Units"
    />
  );
}
