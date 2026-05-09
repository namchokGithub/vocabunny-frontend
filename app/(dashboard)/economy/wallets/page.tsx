"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { walletColumns } from "@/components/operations/column-definitions";
import { economyService } from "@/lib/services/economy.service";

export default function WalletsPage() {
  return (
    <ContentListPage
      columns={walletColumns}
      createLabel="Create Wallet"
      description="Inspect user wallets, balances, and review states."
      loader={economyService.getWallets}
      searchPlaceholder="Search wallets..."
      title="Wallets"
    />
  );
}
