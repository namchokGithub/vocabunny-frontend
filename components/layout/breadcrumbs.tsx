"use client";

import { titleFromSegment } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => ({
    label: titleFromSegment(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link className="hover:text-slate-900" href="/dashboard">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <span>/</span>
          <Link className="hover:text-slate-900" href={item.href}>
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
