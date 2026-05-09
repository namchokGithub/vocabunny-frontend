"use client";

import { unitColumns } from "@/components/content/units/unit-columns";
import { ContentListPage } from "@/components/content/content-list-page";
import { unitsService } from "@/lib/services/content/units.service";

export default function UnitsPage() {
  return (
    <ContentListPage
      columns={unitColumns}
      createLabel="Create Unit"
      description="Manage units and vocabulary volume inside each lesson."
      loader={unitsService.getUnits}
      searchPlaceholder="Search units..."
      title="Units"
    />
  );
}
