import type { NavItem } from "@/types";

export const sidebarNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    allowedRoles: ["admin", "operator", "content_manager"],
  },
  {
    title: "Content",
    href: "/content/sections",
    icon: "folder-kanban",
    allowedRoles: ["admin", "content_manager"],
    children: [
      { title: "Sections", href: "/content/sections" },
      { title: "Lessons", href: "/content/lessons" },
      { title: "Units", href: "/content/units" },
      { title: "Question Sets", href: "/content/question-sets" },
      { title: "Questions", href: "/content/questions" },
    ],
  },
  {
    title: "Quests",
    href: "/quests",
    icon: "scroll-text",
    allowedRoles: ["admin", "operator"],
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: "award",
    allowedRoles: ["admin", "operator"],
  },
  {
    title: "Shop",
    href: "/shop/items",
    icon: "shopping-cart",
    allowedRoles: ["admin", "operator"],
    children: [
      { title: "Items", href: "/shop/items" },
      { title: "Orders", href: "/shop/orders" },
    ],
  },
  {
    title: "Economy",
    href: "/economy/wallets",
    icon: "wallet",
    allowedRoles: ["admin", "operator"],
    children: [
      { title: "Wallets", href: "/economy/wallets" },
      { title: "Transactions", href: "/economy/transactions" },
    ],
  },
  {
    title: "Actors",
    href: "/actors",
    icon: "users-round",
    allowedRoles: ["admin", "operator"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "chart-column",
    allowedRoles: ["admin", "operator"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings-2",
    allowedRoles: ["admin"],
  },
];
