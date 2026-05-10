"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ContentListPage } from "@/components/content/content-list-page";
import { CreateSectionDialog } from "@/features/content/sections/components/create-section-dialog";
import { createSectionColumns } from "@/features/content/sections/components/section-columns";
import { EditSectionDialog } from "@/features/content/sections/components/edit-section-dialog";
import { useToast } from "@/components/ui/toast";
import type { Section } from "@/lib/api/content/sections";
import { sectionsService } from "@/lib/services/content/sections.service";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function SectionsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // Initialize state from URL params
  const [search, setSearchState] = useState(searchParams.get("search") ?? "");
  const [publishedFilter, setPublishedFilterState] = useState<
    boolean | undefined
  >(
    searchParams.has("published")
      ? searchParams.get("published") === "true"
      : undefined,
  );
  const [page, setPageState] = useState(
    Number(searchParams.get("page") ?? "1"),
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  function syncURL(s: string, pub: boolean | undefined, pg: number) {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (pub !== undefined) params.set("published", String(pub));
    if (pg > 1) params.set("page", String(pg));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleSearchApply(value: string) {
    setSearchState(value);

    setPageState(1);

    syncURL(value, publishedFilter, 1);
  }

  function handlePublishedFilterChange(value: boolean | undefined) {
    setPublishedFilterState(value);
    setPageState(1);
    syncURL(search, value, 1);
  }

  function handlePageChange(value: number) {
    setPageState(value);
    syncURL(search, publishedFilter, value);
  }

  function triggerRefresh() {
    setPageState(1);
    syncURL(search, publishedFilter, 1);
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
        onEdit: async (section) => {
          setEditingSection(section);
        },
        onDelete: async (section) => {
          setDeletingSection(section);
        },
      }),
    [],
  );

  return (
    <>
      <ContentListPage
        key={refreshKey}
        columns={columns}
        showRowNumber={true}
        searchValue={search}
        onSearchApply={handleSearchApply}
        loader={() =>
          sectionsService.getSections({
            search: search.trim() || undefined,
            is_published: publishedFilter,
          })
        }
        page={page}
        onPageChange={handlePageChange}
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
