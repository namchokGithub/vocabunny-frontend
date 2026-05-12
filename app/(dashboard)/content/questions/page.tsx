"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ContentListPage } from "@/components/content/content-list-page";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { CreateQuestionDialog } from "@/features/content/questions/components/create-question-dialog";
import { createQuestionColumns } from "@/features/content/questions/components/question-columns";
import { EditQuestionDialog } from "@/features/content/questions/components/edit-question-dialog";
import type { SortDirection } from "@/components/table/data-table";
import type { Question } from "@/lib/api/content/questions";
import { questionsService } from "@/lib/services/content/questions.service";
import type { PaginationParams } from "@/types/pagination";

const QUESTION_SORT_KEYS = ["type", "difficulty", "order_no", "is_active", "updated_at"] as const;
const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

function isQuestionSortKey(value: string | null): value is (typeof QUESTION_SORT_KEYS)[number] {
  return value !== null && QUESTION_SORT_KEYS.includes(value as (typeof QUESTION_SORT_KEYS)[number]);
}

function isSortDirection(value: string | null): value is SortDirection {
  return value === "asc" || value === "desc";
}

function isPageSize(value: number): value is (typeof PAGE_SIZES)[number] {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function QuestionsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialSortParam = searchParams.get("sort");
  const initialDirectionParam = searchParams.get("direction");

  const [search, setSearchState] = useState(searchParams.get("search") ?? "");
  const [activeFilter, setActiveFilterState] = useState<boolean | undefined>(
    searchParams.has("active") ? searchParams.get("active") === "true" : undefined,
  );
  const [page, setPageState] = useState(Number(searchParams.get("page") ?? "1"));
  const rawLimit = Number(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE));
  const [limit, setLimitState] = useState<number>(isPageSize(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>(
    isQuestionSortKey(initialSortParam) ? initialSortParam : undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    isSortDirection(initialDirectionParam) ? initialDirectionParam : undefined,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);

  function syncURL(s: string, active: boolean | undefined, pg: number, lim: number, sort?: string, direction?: SortDirection) {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (active !== undefined) params.set("active", String(active));
    if (pg > 1) params.set("page", String(pg));
    if (lim !== DEFAULT_PAGE_SIZE) params.set("limit", String(lim));
    if (sort) params.set("sort", sort);
    if (sort && direction) params.set("direction", direction);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSearchApply(value: string) {
    setSearchState(value);
    setPageState(1);
    syncURL(value, activeFilter, 1, limit, sortKey, sortDirection);
  }

  function handleActiveFilterChange(value: boolean | undefined) {
    setActiveFilterState(value);
    setPageState(1);
    syncURL(search, value, 1, limit, sortKey, sortDirection);
  }

  function handlePageChange(value: number) {
    setPageState(value);
    syncURL(search, activeFilter, value, limit, sortKey, sortDirection);
  }

  function handleLimitChange(value: number) {
    setLimitState(value);
    setPageState(1);
    syncURL(search, activeFilter, 1, value, sortKey, sortDirection);
  }

  function handleSortChange(nextSortKey?: string, nextSortDirection?: SortDirection) {
    setSortKey(nextSortKey);
    setSortDirection(nextSortDirection);
    setPageState(1);
    syncURL(search, activeFilter, 1, limit, nextSortKey, nextSortDirection);
  }

  function triggerRefresh() {
    setPageState(1);
    syncURL(search, activeFilter, 1, limit, sortKey, sortDirection);
    setRefreshKey((current) => current + 1);
  }

  async function handleDeleteConfirm() {
    if (!deletingQuestion) return;
    await questionsService.deleteQuestion(deletingQuestion.id);
    showToast({ title: "Question deleted", description: "The question was removed successfully.", variant: "success" });
    setDeletingQuestion(null);
    triggerRefresh();
  }

  const columns = useMemo(
    () => createQuestionColumns({
      onEdit: async (question) => setEditingQuestion(question),
      onDelete: async (question) => setDeletingQuestion(question),
    }),
    [],
  );

  return (
    <>
      <ContentListPage
        refreshSignal={refreshKey}
        columns={columns}
        showRowNumber={true}
        searchValue={search}
        onSearchApply={handleSearchApply}
        loader={(params?: PaginationParams) => questionsService.getQuestions({
          page: params?.page,
          limit: params?.limit,
          search: search.trim() || undefined,
          is_active: activeFilter,
          sort_by: sortKey,
          sort_order: sortKey && sortDirection ? (sortDirection.toUpperCase() as "ASC" | "DESC") : undefined,
          include: "question_set",
        })}
        page={page}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        publishedFilter={activeFilter}
        onPublishedFilterChange={handleActiveFilterChange}
        filterLabels={{ trueLabel: "Active", falseLabel: "Inactive" }}
        getRowKey={(question) => question.id}
        createAction={<CreateQuestionDialog onCreated={triggerRefresh} />}
        createLabel="Create Question"
        description="Manage individual questions and answer choices."
        searchPlaceholder="Search questions..."
        title="Questions"
      />
      <EditQuestionDialog
        onClose={() => setEditingQuestion(null)}
        onUpdated={() => { setEditingQuestion(null); triggerRefresh(); }}
        open={!!editingQuestion}
        question={editingQuestion}
      />
      <ConfirmDialog
        open={!!deletingQuestion}
        title="Delete question?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingQuestion(null)}
      />
    </>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense>
      <QuestionsPageContent />
    </Suspense>
  );
}
