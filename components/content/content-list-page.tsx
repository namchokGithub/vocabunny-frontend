"use client";

import Link from "next/link";

import { useCallback, useState, type ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-header";

import { LoadingTable } from "@/components/table/loading-table";

import { DataTable, type Column } from "@/components/table/data-table";

import { PrimaryButton, SecondaryButton } from "@/components/ui/button";

import { SearchInput } from "@/components/ui/search-input";

import { useAsyncData } from "@/lib/hooks/use-async-data";
import type { PaginatedResult, PaginationParams } from "@/types/pagination";
import { cn } from "@/lib/utils";

interface ContentListPageProps<T> {
  title: string;
  description: string;
  createLabel: string;
  searchPlaceholder: string;
  loader: (params?: PaginationParams) => Promise<PaginatedResult<T>>;
  columns: Column<T>[];
  topNote?: ReactNode;
  createHref?: string;
  createAction?: ReactNode;
  defaultPageSize?: number;
  showRowNumber?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  publishedFilter?: boolean | undefined;
  onPublishedFilterChange?: (value: boolean | undefined) => void;
}

export function ContentListPage<T>({
  title,
  description,
  createLabel,
  searchPlaceholder,
  loader,
  columns,
  topNote,
  createHref,
  createAction,
  defaultPageSize = 10,
  showRowNumber = false,
  searchValue,
  onSearchChange,
  publishedFilter,
  onPublishedFilterChange,
}: ContentListPageProps<T>) {
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const paginatedLoader = useCallback(
    () =>
      loader({
        page,
        limit: defaultPageSize,
      }),
    [defaultPageSize, loader, page],
  );
  const [draftSearch, setDraftSearch] = useState(searchValue ?? "");
  const isSearchDirty = draftSearch !== (searchValue ?? "");
  const { data, isLoading, error } = useAsyncData(paginatedLoader);
  const createButton = <PrimaryButton>{createLabel}</PrimaryButton>;
  const paging = data?.paging;
  const hasPreviousPage = (paging?.page ?? page) > 1;
  const hasNextPage = paging ? paging.page < paging.total_pages : false;

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {/* <SecondaryButton>Export</SecondaryButton> */}

            {createAction ? (
              createAction
            ) : createHref ? (
              <Link href={createHref}>{createButton}</Link>
            ) : (
              createButton
            )}
          </>
        }
      />

      {topNote}

      <div className="card mb-6 rounded-[28px] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <SearchInput
              placeholder={searchPlaceholder}
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
            />
            <PrimaryButton
              className={cn(
                "transition-all duration-200 outline-none! focus-visible:ring-offset-0!",
                isSearchDirty &&
                  "scale-[1.03] border border-(--green-500) bg-green-500! shadow-lg ring-2 shadow-green-500/20 outline-none! hover:bg-green-600!",
              )}
              onClick={() => onSearchChange?.(draftSearch)}
            >
              Search
            </PrimaryButton>

            <div className="relative">
              <SecondaryButton
                onClick={() => setFilterOpen((current) => !current)}
              >
                {publishedFilter === true
                  ? "Published"
                  : publishedFilter === false
                    ? "Draft"
                    : "Filters"}
              </SecondaryButton>

              {filterOpen ? (
                <div className="absolute left-0 z-20 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      onPublishedFilterChange?.(undefined);

                      setFilterOpen(false);
                    }}
                  >
                    All
                  </button>

                  <button
                    className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      onPublishedFilterChange?.(true);

                      setFilterOpen(false);
                    }}
                  >
                    Published
                  </button>

                  <button
                    className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      onPublishedFilterChange?.(false);

                      setFilterOpen(false);
                    }}
                  >
                    Draft
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>
              {paging
                ? `Page ${paging.page} of ${paging.total_pages} • ${paging.total} records`
                : "Loading pagination..."}
            </span>

            <div className="flex gap-2">
              <SecondaryButton
                disabled={!hasPreviousPage || isLoading}
                onClick={() => setPage((current) => current - 1)}
              >
                Prev
              </SecondaryButton>

              <SecondaryButton
                disabled={!hasNextPage || isLoading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          showRowNumber={showRowNumber}
        />
      )}
    </div>
  );
}
