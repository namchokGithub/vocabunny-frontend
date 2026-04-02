"use client";

import { SecondaryButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Column } from "@/components/table/data-table";
import { formatCurrency } from "@/lib/utils";
import type {
  Actor,
  CoinTransaction,
  QuestDefinition,
  ShopItem,
  ShopOrder,
  Wallet,
} from "@/types";

export const questColumns: Column<QuestDefinition>[] = [
  {
    key: "title",
    header: "Quest",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.title}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "rewardCoins", header: "Reward", render: (row) => `${row.rewardCoins} coins` },
  { key: "frequency", header: "Frequency", render: (row) => row.frequency },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: () => <SecondaryButton>Edit</SecondaryButton> },
];

export const shopItemColumns: Column<ShopItem>[] = [
  {
    key: "name",
    header: "Item",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "price", header: "Price", render: (row) => formatCurrency(row.price) },
  { key: "category", header: "Category", render: (row) => row.category },
  { key: "stockStatus", header: "Stock", render: (row) => <StatusBadge value={row.stockStatus} /> },
];

export const shopOrderColumns: Column<ShopOrder>[] = [
  {
    key: "orderNo",
    header: "Order",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.orderNo}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "itemName", header: "Item", render: (row) => row.itemName },
  { key: "buyer", header: "Buyer", render: (row) => row.buyer },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
];

export const walletColumns: Column<Wallet>[] = [
  {
    key: "owner",
    header: "Wallet Owner",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.owner}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "balance", header: "Balance", render: (row) => formatCurrency(row.balance) },
  { key: "tier", header: "Tier", render: (row) => row.tier },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
];

export const transactionColumns: Column<CoinTransaction>[] = [
  {
    key: "walletOwner",
    header: "Wallet",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.walletOwner}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "type", header: "Type", render: (row) => row.type },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  { key: "source", header: "Source", render: (row) => row.source },
  { key: "createdAt", header: "Created At", render: (row) => row.createdAt },
];

export const actorColumns: Column<Actor>[] = [
  {
    key: "name",
    header: "Actor",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">{row.id}</p>
      </div>
    ),
  },
  { key: "actorType", header: "Type", render: (row) => <StatusBadge value={row.actorType} /> },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "country", header: "Country", render: (row) => row.country },
];
