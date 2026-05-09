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
}: ContentListPageProps<T>) {
  const [page, setPage] = useState(1);
  const paginatedLoader = useCallback(
    () =>
      loader({
        page,
        limit: defaultPageSize,
      }),
    [defaultPageSize, loader, page],
  );
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
            <SearchInput placeholder={searchPlaceholder} />

            <SecondaryButton>Filters</SecondaryButton>
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
        <DataTable columns={columns} rows={data?.items ?? []} />
      )}
    </div>
  );
}
