"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Lesson } from "@/lib/api/content/lessons";
import { SecondaryButton, DangerButton } from "@/components/ui/button";

interface LessonRowActionsProps {
  lesson: Lesson;
  onEdit?: (lesson: Lesson) => Promise<void>;
  onDelete?: (lesson: Lesson) => Promise<void>;
}

export function LessonRowActions({ lesson, onEdit, onDelete }: LessonRowActionsProps) {
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
            await onEdit(lesson);
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
            await onDelete(lesson);
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
