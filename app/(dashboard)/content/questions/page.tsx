"use client";

import { questionColumns } from "@/components/content/questions/question-columns";
import { ContentListPage } from "@/components/content/content-list-page";
import { questionsService } from "@/lib/services/content/questions.service";

export default function QuestionsPage() {
  return (
    <ContentListPage
      columns={questionColumns}
      createLabel="Create Question"
      description="Maintain individual question records and question type coverage."
      loader={questionsService.getQuestions}
      searchPlaceholder="Search questions..."
      title="Questions"
    />
  );
}
