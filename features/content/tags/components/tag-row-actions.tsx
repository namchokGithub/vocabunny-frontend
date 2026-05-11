"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Tag } from "@/lib/api/content/tags";
import { SecondaryButton, DangerButton } from "@/components/ui/button";

interface TagRowActionsProps {
  tag: Tag;
  onEdit?: (tag: Tag) => Promise<void>;
  onDelete?: (tag: Tag) => Promise<void>;
}

export function TagRowActions({ tag, onEdit, onDelete }: TagRowActionsProps) {
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
            await onEdit(tag);
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
            await onDelete(tag);
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
