"use client";

import { PageHeader } from "@/components/layout/page-header";
import { LoadingTable } from "@/components/table/loading-table";
import { DataTable, type Column } from "@/components/table/data-table";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import Link from "next/link";
import type { ReactNode } from "react";
import { Section } from "@/lib/api/content/sections";

interface ContentListPageProps {
  title: string;
  description: string;
  createLabel: string;
  searchPlaceholder: string;
  loader: () => Promise<Section[]>;
  columns: Column<Section>[];
  topNote?: ReactNode;
  createHref?: string;
}

export function ContentListPage({
  title,
  description,
  createLabel,
  searchPlaceholder,
  loader,
  columns,
  topNote,
  createHref,
}: ContentListPageProps) {
  const { data, isLoading } = useAsyncData(loader);
  const createButton = <PrimaryButton>{createLabel}</PrimaryButton>;

  return (
    <div>
      <PageHeader
        actions={
          <>
            <SecondaryButton>Export</SecondaryButton>
            {createHref ? (
              <Link href={createHref}>{createButton}</Link>
            ) : (
              createButton
            )}
          </>
        }
        description={description}
        title={title}
      />

      {topNote}

      <div className="card mb-6 rounded-[28px] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row">
            <SearchInput placeholder={searchPlaceholder} />
            <SecondaryButton>Filters</SecondaryButton>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Page 1 of 12</span>
            <div className="flex gap-2">
              <SecondaryButton>Prev</SecondaryButton>
              <SecondaryButton>Next</SecondaryButton>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : (
        <DataTable columns={columns} rows={data ?? []} />
      )}
    </div>
  );
}
