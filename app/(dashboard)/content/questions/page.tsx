"use client";

import { questionColumns } from "@/components/content/column-definitions";
import { ContentListPage } from "@/components/content/content-list-page";
import { questionApi } from "@/lib/api";

export default function QuestionsPage() {
  return (
    <ContentListPage
      columns={questionColumns}
      createLabel="Create Question"
      description="Maintain individual question records and question type coverage."
      loader={questionApi.getQuestions}
      searchPlaceholder="Search questions..."
      title="Questions"
    />
  );
}
