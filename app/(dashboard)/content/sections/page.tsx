"use client";

import { sectionColumns } from "@/components/content/sections/section-columns";
import { ContentListPage } from "@/components/content/content-list-page";
import { sectionsService } from "@/lib/services/content/sections.service";

export default function SectionsPage() {
  return (
    <ContentListPage
      columns={sectionColumns}
      createLabel="Create Section"
      description="Manage top-level learning sections used to organize the learner journey."
      loader={sectionsService.getSections}
      searchPlaceholder="Search sections..."
      title="Sections"
    />
  );
}
