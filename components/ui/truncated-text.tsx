"use client";

import { createPortal } from "react-dom";
import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Lines = 1 | 2 | 3 | 4 | 5;

const lineClampClass: Record<Lines, string> = {
  1: "truncate",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

interface TruncatedTextProps {
  children: string;
  lines?: Lines;
  className?: string;
  tooltipMaxWidth?: number;
}

export function TruncatedText({
  children,
  lines = 1,
  className,
  tooltipMaxWidth = 320,
}: TruncatedTextProps) {
  const tooltipId = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  function isTruncated(el: HTMLSpanElement): boolean {
    if (lines === 1) return el.scrollWidth > el.offsetWidth;
    return el.scrollHeight > el.offsetHeight;
  }

  function handleMouseEnter() {
    const el = ref.current;
    if (el && isTruncated(el)) {
      setAnchorRect(el.getBoundingClientRect());
    }
  }

  function handleMouseLeave() {
    setAnchorRect(null);
  }

  return (
    <>
      <span
        ref={ref}
        className={cn(lineClampClass[lines], "cursor-default", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-describedby={anchorRect ? tooltipId : undefined}
      >
        {children}
      </span>

      {anchorRect
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none fixed z-[9999] -translate-y-full rounded-xl bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl"
              style={{
                top: anchorRect.top - 6,
                left: anchorRect.left,
                maxWidth: tooltipMaxWidth,
              }}
            >
              <span className="break-words">{children}</span>
              <div
                aria-hidden="true"
                className="absolute left-3 top-full h-0 w-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-900"
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
