"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ContentListPage } from "@/components/content/content-list-page";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { CreateQuestionSetDialog } from "@/features/content/question-sets/components/create-question-set-dialog";
import { createQuestionSetColumns } from "@/features/content/question-sets/components/question-set-columns";
import { EditQuestionSetDialog } from "@/features/content/question-sets/components/edit-question-set-dialog";
import type { SortDirection } from "@/components/table/data-table";
import type { QuestionSet } from "@/lib/api/content/question-sets";
import { questionSetsService } from "@/lib/services/content/question-sets.service";
import type { PaginationParams } from "@/types/pagination";

const QUESTION_SET_SORT_KEYS = ["title", "order_no", "version", "is_published", "updated_at"] as const;
const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

function isQuestionSetSortKey(value: string | null): value is (typeof QUESTION_SET_SORT_KEYS)[number] {
  return value !== null && QUESTION_SET_SORT_KEYS.includes(value as (typeof QUESTION_SET_SORT_KEYS)[number]);
}

function isSortDirection(value: string | null): value is SortDirection {
  return value === "asc" || value === "desc";
}

function isPageSize(value: number): value is (typeof PAGE_SIZES)[number] {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function QuestionSetsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialSortParam = searchParams.get("sort");
  const initialDirectionParam = searchParams.get("direction");

  const [search, setSearchState] = useState(searchParams.get("search") ?? "");
  const [publishedFilter, setPublishedFilterState] = useState<boolean | undefined>(
    searchParams.has("published") ? searchParams.get("published") === "true" : undefined,
  );
  const [page, setPageState] = useState(Number(searchParams.get("page") ?? "1"));
  const rawLimit = Number(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE));
  const [limit, setLimitState] = useState<number>(isPageSize(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>(
    isQuestionSetSortKey(initialSortParam) ? initialSortParam : undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    isSortDirection(initialDirectionParam) ? initialDirectionParam : undefined,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingQuestionSet, setEditingQuestionSet] = useState<QuestionSet | null>(null);
  const [deletingQuestionSet, setDeletingQuestionSet] = useState<QuestionSet | null>(null);

  function syncURL(s: string, pub: boolean | undefined, pg: number, lim: number, sort?: string, direction?: SortDirection) {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (pub !== undefined) params.set("published", String(pub));
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
    syncURL(value, publishedFilter, 1, limit, sortKey, sortDirection);
  }

  function handlePublishedFilterChange(value: boolean | undefined) {
    setPublishedFilterState(value);
    setPageState(1);
    syncURL(search, value, 1, limit, sortKey, sortDirection);
  }

  function handlePageChange(value: number) {
    setPageState(value);
    syncURL(search, publishedFilter, value, limit, sortKey, sortDirection);
  }

  function handleLimitChange(value: number) {
    setLimitState(value);
    setPageState(1);
    syncURL(search, publishedFilter, 1, value, sortKey, sortDirection);
  }

  function handleSortChange(nextSortKey?: string, nextSortDirection?: SortDirection) {
    setSortKey(nextSortKey);
    setSortDirection(nextSortDirection);
    setPageState(1);
    syncURL(search, publishedFilter, 1, limit, nextSortKey, nextSortDirection);
  }

  function triggerRefresh() {
    setPageState(1);
    syncURL(search, publishedFilter, 1, limit, sortKey, sortDirection);
    setRefreshKey((current) => current + 1);
  }

  async function handleDeleteConfirm() {
    if (!deletingQuestionSet) return;
    await questionSetsService.deleteQuestionSet(deletingQuestionSet.id);
    showToast({ title: "Question set deleted", description: "The question set was removed successfully.", variant: "success" });
    setDeletingQuestionSet(null);
    triggerRefresh();
  }

  const columns = useMemo(
    () => createQuestionSetColumns({
      onEdit: async (qs) => setEditingQuestionSet(qs),
      onDelete: async (qs) => setDeletingQuestionSet(qs),
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
        loader={(params?: PaginationParams) => questionSetsService.getQuestionSets({
          page: params?.page,
          limit: params?.limit,
          search: search.trim() || undefined,
          is_published: publishedFilter,
          sort_by: sortKey,
          sort_order: sortKey && sortDirection ? (sortDirection.toUpperCase() as "ASC" | "DESC") : undefined,
          include: "unit",
        })}
        page={page}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        publishedFilter={publishedFilter}
        onPublishedFilterChange={handlePublishedFilterChange}
        getRowKey={(qs) => qs.id}
        createAction={<CreateQuestionSetDialog onCreated={triggerRefresh} />}
        createLabel="Create Question Set"
        description="Build and review question sets tied to units."
        searchPlaceholder="Search question sets..."
        title="Question Sets"
      />
      <EditQuestionSetDialog
        onClose={() => setEditingQuestionSet(null)}
        onUpdated={() => { setEditingQuestionSet(null); triggerRefresh(); }}
        open={!!editingQuestionSet}
        questionSet={editingQuestionSet}
      />
      <ConfirmDialog
        open={!!deletingQuestionSet}
        title="Delete question set?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingQuestionSet(null)}
      />
    </>
  );
}

export default function QuestionSetsPage() {
  return (
    <Suspense>
      <QuestionSetsPageContent />
    </Suspense>
  );
}
