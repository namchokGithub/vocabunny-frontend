"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ContentListPage } from "@/components/content/content-list-page";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { CreateTagDialog } from "@/features/content/tags/components/create-tag-dialog";
import { createTagColumns } from "@/features/content/tags/components/tag-columns";
import { EditTagDialog } from "@/features/content/tags/components/edit-tag-dialog";
import type { SortDirection } from "@/components/table/data-table";
import type { Tag } from "@/lib/api/content/tags";
import { tagsService } from "@/lib/services/content/tags.service";
import type { PaginationParams } from "@/types/pagination";

const TAG_SORT_KEYS = ["name", "updated_at"] as const;
const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;

function isTagSortKey(value: string | null): value is (typeof TAG_SORT_KEYS)[number] {
  return value !== null && TAG_SORT_KEYS.includes(value as (typeof TAG_SORT_KEYS)[number]);
}

function isSortDirection(value: string | null): value is SortDirection {
  return value === "asc" || value === "desc";
}

function isPageSize(value: number): value is (typeof PAGE_SIZES)[number] {
  return (PAGE_SIZES as readonly number[]).includes(value);
}

function TagsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialSortParam = searchParams.get("sort");
  const initialDirectionParam = searchParams.get("direction");

  const [search, setSearchState] = useState(searchParams.get("search") ?? "");
  const [page, setPageState] = useState(Number(searchParams.get("page") ?? "1"));
  const rawLimit = Number(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE));
  const [limit, setLimitState] = useState<number>(isPageSize(rawLimit) ? rawLimit : DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>(
    isTagSortKey(initialSortParam) ? initialSortParam : undefined,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    isSortDirection(initialDirectionParam) ? initialDirectionParam : undefined,
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

  function syncURL(s: string, pg: number, lim: number, sort?: string, direction?: SortDirection) {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
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
    syncURL(value, 1, limit, sortKey, sortDirection);
  }

  function handlePageChange(value: number) {
    setPageState(value);
    syncURL(search, value, limit, sortKey, sortDirection);
  }

  function handleLimitChange(value: number) {
    setLimitState(value);
    setPageState(1);
    syncURL(search, 1, value, sortKey, sortDirection);
  }

  function handleSortChange(nextSortKey?: string, nextSortDirection?: SortDirection) {
    setSortKey(nextSortKey);
    setSortDirection(nextSortDirection);
    setPageState(1);
    syncURL(search, 1, limit, nextSortKey, nextSortDirection);
  }

  function triggerRefresh() {
    setPageState(1);
    syncURL(search, 1, limit, sortKey, sortDirection);
    setRefreshKey((current) => current + 1);
  }

  async function handleDeleteConfirm() {
    if (!deletingTag) return;
    await tagsService.deleteTag(deletingTag.id);
    showToast({ title: "Tag deleted", description: "The tag was removed successfully.", variant: "success" });
    setDeletingTag(null);
    triggerRefresh();
  }

  const columns = useMemo(
    () => createTagColumns({
      onEdit: async (tag) => setEditingTag(tag),
      onDelete: async (tag) => setDeletingTag(tag),
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
        loader={(params?: PaginationParams) => tagsService.getTags({
          page: params?.page,
          limit: params?.limit,
          search: search.trim() || undefined,
          sort_by: sortKey,
          sort_order: sortKey && sortDirection ? (sortDirection.toUpperCase() as "ASC" | "DESC") : undefined,
        })}
        page={page}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        getRowKey={(tag) => tag.id}
        createAction={<CreateTagDialog onCreated={triggerRefresh} />}
        createLabel="Create Tag"
        description="Manage vocabulary tags for question filtering and curriculum organization."
        searchPlaceholder="Search tags..."
        title="Tags"
      />
      <EditTagDialog
        onClose={() => setEditingTag(null)}
        onUpdated={() => { setEditingTag(null); triggerRefresh(); }}
        open={!!editingTag}
        tag={editingTag}
      />
      <ConfirmDialog
        open={!!deletingTag}
        title="Delete tag?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingTag(null)}
      />
    </>
  );
}

export default function TagsPage() {
  return (
    <Suspense>
      <TagsPageContent />
    </Suspense>
  );
}
