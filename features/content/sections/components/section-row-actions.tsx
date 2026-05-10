"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Section } from "@/lib/api/content/sections";

import { SecondaryButton, DangerButton } from "@/components/ui/button";

interface SectionRowActionsProps {
  section: Section;

  onEdit?: (section: Section) => Promise<void>;

  onDelete?: (section: Section) => Promise<void>;
}

export function SectionRowActions({
  section,
  onEdit,
  onDelete,
}: SectionRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <SecondaryButton
        isLoading={isEditing}
        disabled={isEditing || isDeleting}
        className="h-9 px-3"
        onClick={async () => {
          if (!onEdit) return;
          setIsEditing(true);
          try {
            await onEdit(section);
          } finally {
            setIsEditing(false);
          }
        }}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </SecondaryButton>

      <DangerButton
        isLoading={isDeleting}
        disabled={isEditing || isDeleting}
        className="h-9 px-3"
        onClick={async () => {
          if (!onDelete) return;
          setIsDeleting(true);
          try {
            await onDelete(section);
          } finally {
            setIsDeleting(false);
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </DangerButton>
    </div>
  );
}
