import type { RouteAccessMeta, StaffRole } from "@/types";

const allRoles: StaffRole[] = ["admin", "operator", "content_manager"];

export const routeAccessMeta: RouteAccessMeta[] = [
  { pattern: "/dashboard", allowedRoles: allRoles, label: "Dashboard" },
  { pattern: "/content", allowedRoles: ["admin", "content_manager"], label: "Content" },
  { pattern: "/quests", allowedRoles: ["admin", "operator"], label: "Quests" },
  { pattern: "/achievements", allowedRoles: ["admin", "operator"], label: "Achievements" },
  { pattern: "/shop", allowedRoles: ["admin", "operator"], label: "Shop" },
  { pattern: "/economy", allowedRoles: ["admin", "operator"], label: "Economy" },
  { pattern: "/actors", allowedRoles: ["admin", "operator"], label: "Actors" },
  { pattern: "/analytics", allowedRoles: ["admin", "operator"], label: "Analytics" },
  { pattern: "/settings", allowedRoles: ["admin"], label: "Settings" },
];

export function getRouteAccess(pathname: string) {
  const matches = routeAccessMeta
    .filter((route) => pathname === route.pattern || pathname.startsWith(`${route.pattern}/`))
    .sort((left, right) => right.pattern.length - left.pattern.length);

  return matches[0] ?? null;
}

export function hasRouteAccess(role: StaffRole, pathname: string) {
  const route = getRouteAccess(pathname);
  if (!route) {
    return true;
  }

  return route.allowedRoles.includes(role);
}
