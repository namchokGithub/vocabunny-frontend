"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ContentListPage } from "@/components/content/content-list-page";
import { CreateSectionDialog } from "@/features/content/sections/components/create-section-dialog";
import { createSectionColumns } from "@/features/content/sections/components/section-columns";
import { EditSectionDialog } from "@/features/content/sections/components/edit-section-dialog";
import type { SortDirection } from "@/components/table/data-table";
import { useToast } from "@/components/ui/toast";
import type { Section } from "@/lib/api/content/sections";
import { sectionsService } from "@/lib/services/content/sections.service";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PaginationParams } from "@/types/pagination";

const SECTION_SORT_KEYS = ["title", "order_no", "updated_at", "is_published"] as const;
const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

function isSectionSortKey(value: string | null): value is (typeof SECTION_SORT_KEYS)[number] {
  return value !== null && SECTION_SORT_KEYS.includes(value as (typeof SECTION_SORT_KEYS)[number]);
}

function isSortDirection(value: string | null): value is SortDirection {
  return value === "asc" || value === "desc";
}

function isPageSize(value: number): value is (typeof PAGE_SIZES)[number] {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function SectionsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const initialSortParam = searchParams.get("sort");
  const initialDirectionParam = searchParams.get("direction");

  // Initialize all query state from URL params
  const [search, setSearchState] = useState(searchParams.get("search") ?? "");
  const [publishedFilter, setPublishedFilterState] = useState<boolean | undefined>(
    searchParams.has("published")
      ? searchParams.get("published") === "true"
      : undefined,
  );
  const [page, setPageState] = useState(Number(searchParams.get("page") ?? "1"));
  const rawLimit = Number(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE));
  const [limit, setLimitState] = useState<number>(isPageSize(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>(
    isSectionSortKey(initialSortParam) ? initialSortParam : undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    isSortDirection(initialDirectionParam) ? initialDirectionParam : undefined,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  function syncURL(
    s: string,
    pub: boolean | undefined,
    pg: number,
    lim: number,
    sort?: string,
    direction?: SortDirection,
  ) {
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
    if (!deletingSection) return;
    await sectionsService.deleteSection(deletingSection.id);
    showToast({
      title: "Section deleted",
      description: "The section was removed successfully.",
      variant: "success",
    });
    setDeletingSection(null);
    triggerRefresh();
  }

  const columns = useMemo(
    () =>
      createSectionColumns({
        onEdit: async (section) => setEditingSection(section),
        onDelete: async (section) => setDeletingSection(section),
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
        loader={(params?: PaginationParams) =>
          sectionsService.getSections({
            page: params?.page,
            limit: params?.limit,
            search: search.trim() || undefined,
            is_published: publishedFilter,
            sort_by: sortKey,
            sort_order:
              sortKey && sortDirection
                ? (sortDirection.toUpperCase() as "ASC" | "DESC")
                : undefined,
          })
        }
        page={page}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        publishedFilter={publishedFilter}
        onPublishedFilterChange={handlePublishedFilterChange}
        getRowKey={(section) => section.id}
        createAction={<CreateSectionDialog onCreated={triggerRefresh} />}
        createLabel="Create Section"
        description="Manage top-level learning sections used to organize the learner journey."
        searchPlaceholder="Search sections..."
        title="Sections"
      />
      <EditSectionDialog
        onClose={() => setEditingSection(null)}
        onUpdated={() => {
          setEditingSection(null);
          triggerRefresh();
        }}
        open={!!editingSection}
        section={editingSection}
      />
      <ConfirmDialog
        open={!!deletingSection}
        title="Delete section?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingSection(null)}
      />
    </>
  );
}

export default function SectionsPage() {
  return (
    <Suspense>
      <SectionsPageContent />
    </Suspense>
  );
}
