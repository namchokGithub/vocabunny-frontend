"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { walletColumns } from "@/components/operations/column-definitions";
import { economyApi } from "@/lib/api";

export default function WalletsPage() {
  return (
    <ContentListPage
      columns={walletColumns}
      createLabel="Create Wallet"
      description="Inspect user wallets, balances, and review states."
      loader={economyApi.getWallets}
      searchPlaceholder="Search wallets..."
      title="Wallets"
    />
  );
}
