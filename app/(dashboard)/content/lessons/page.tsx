"use client";

import { lessonColumns } from "@/components/content/lessons/lesson-columns";
import { ContentListPage } from "@/components/content/content-list-page";
import { lessonsService } from "@/lib/services/content/lessons.service";

export default function LessonsPage() {
  return (
    <ContentListPage
      columns={lessonColumns}
      createLabel="Create Lesson"
      description="Review lesson metadata, grouping, and publishing status."
      loader={lessonsService.getLessons}
      searchPlaceholder="Search lessons..."
      title="Lessons"
    />
  );
}
