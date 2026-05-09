"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { CreateSectionDialog } from "@/features/content/sections/components/create-section-dialog";
import { sectionColumns } from "@/features/content/sections/components/section-columns";
import { sectionsService } from "@/lib/services/content/sections.service";
import { useState } from "react";

export default function SectionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <ContentListPage
      key={refreshKey}
      columns={sectionColumns}
      createAction={
        <CreateSectionDialog onCreated={() => setRefreshKey((current) => current + 1)} />
      }
      createLabel="Create Section"
      description="Manage top-level learning sections used to organize the learner journey."
      loader={sectionsService.getSections}
      searchPlaceholder="Search sections..."
      title="Sections"
    />
  );
}
