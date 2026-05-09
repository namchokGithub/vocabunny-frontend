"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { CreateSectionDialog } from "@/features/content/sections/components/create-section-dialog";
import { createSectionColumns } from "@/features/content/sections/components/section-columns";
import { EditSectionDialog } from "@/features/content/sections/components/edit-section-dialog";
import { useToast } from "@/components/ui/toast";
import type { Section } from "@/lib/api/content/sections";
import { sectionsService } from "@/lib/services/content/sections.service";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function SectionsPage() {
  const { showToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  async function handleDeleteConfirm() {
    if (!deletingSection) {
      return;
    }

    await sectionsService.deleteSection(deletingSection.id);

    showToast({
      title: "Section deleted",
      description: "The section was removed successfully.",
      variant: "success",
    });

    setDeletingSection(null);

    setRefreshKey((current) => current + 1);
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
        createAction={
          <CreateSectionDialog
            onCreated={() => setRefreshKey((current) => current + 1)}
          />
        }
        createLabel="Create Section"
        description="Manage top-level learning sections used to organize the learner journey."
        loader={sectionsService.getSections}
        searchPlaceholder="Search sections..."
        title="Sections"
      />
      <EditSectionDialog
        onClose={() => setEditingSection(null)}
        onUpdated={() => {
          setEditingSection(null);
          setRefreshKey((current) => current + 1);
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
