"use client";

interface SectionStatusBadgeProps {
  isPublished: boolean;
}

export function SectionStatusBadge({ isPublished }: SectionStatusBadgeProps) {
  return (
    <span
      className={
        isPublished
          ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
          : "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
      }
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
