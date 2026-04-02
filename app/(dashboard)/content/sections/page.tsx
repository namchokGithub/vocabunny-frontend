"use client";

import { sectionColumns } from "@/components/content/column-definitions";
import { ContentListPage } from "@/components/content/content-list-page";
import { contentApi } from "@/lib/api";

export default function SectionsPage() {
  return (
    <ContentListPage
      columns={sectionColumns}
      createLabel="Create Section"
      description="Manage top-level learning sections used to organize the learner journey."
      loader={contentApi.getSections}
      searchPlaceholder="Search sections..."
      title="Sections"
    />
  );
}
