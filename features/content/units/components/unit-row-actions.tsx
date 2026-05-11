"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Unit } from "@/lib/api/content/units";
import { SecondaryButton, DangerButton } from "@/components/ui/button";

interface UnitRowActionsProps {
  unit: Unit;
  onEdit?: (unit: Unit) => Promise<void>;
  onDelete?: (unit: Unit) => Promise<void>;
}

export function UnitRowActions({ unit, onEdit, onDelete }: UnitRowActionsProps) {
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
            await onEdit(unit);
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
            await onDelete(unit);
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
