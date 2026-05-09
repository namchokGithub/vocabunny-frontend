"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { transactionColumns } from "@/components/operations/column-definitions";
import { economyService } from "@/lib/services/economy.service";

export default function TransactionsPage() {
  return (
    <ContentListPage
      columns={transactionColumns}
      createLabel="Adjust Coins"
      description="Inspect coin movement, earning sources, and manual adjustments."
      loader={economyService.getTransactions}
      searchPlaceholder="Search transactions..."
      title="Coin Transactions"
    />
  );
}
