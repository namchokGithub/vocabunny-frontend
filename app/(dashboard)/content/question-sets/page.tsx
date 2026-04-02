"use client";

import { questionSetColumns } from "@/components/content/column-definitions";
import { ContentListPage } from "@/components/content/content-list-page";
import { SecondaryButton } from "@/components/ui/button";
import { contentApi } from "@/lib/api";
import Link from "next/link";

export default function QuestionSetsPage() {
  return (
    <ContentListPage
      columns={questionSetColumns}
      createLabel="Create Question Set"
      createHref="/content/question-sets/create"
      description="Build and review quiz collections tied to units and gameplay modes."
      loader={contentApi.getQuestionSets}
      searchPlaceholder="Search question sets..."
      title="Question Sets"
      topNote={
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span className="font-semibold">Preferred flow:</span> use the create form to scaffold new sets.
          <Link href="/content/question-sets/create">
            <SecondaryButton className="ml-3">Open form</SecondaryButton>
          </Link>
        </div>
      }
    />
  );
}
