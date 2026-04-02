"use client";

import { lessonColumns } from "@/components/content/column-definitions";
import { ContentListPage } from "@/components/content/content-list-page";
import { contentApi } from "@/lib/api";

export default function LessonsPage() {
  return (
    <ContentListPage
      columns={lessonColumns}
      createLabel="Create Lesson"
      description="Review lesson metadata, grouping, and publishing status."
      loader={contentApi.getLessons}
      searchPlaceholder="Search lessons..."
      title="Lessons"
    />
  );
}
