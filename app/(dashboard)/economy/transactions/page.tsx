"use client";

import { ContentListPage } from "@/components/content/content-list-page";
import { transactionColumns } from "@/components/operations/column-definitions";
import { economyApi } from "@/lib/api";

export default function TransactionsPage() {
  return (
    <ContentListPage
      columns={transactionColumns}
      createLabel="Adjust Coins"
      description="Inspect coin movement, earning sources, and manual adjustments."
      loader={economyApi.getTransactions}
      searchPlaceholder="Search transactions..."
      title="Coin Transactions"
    />
  );
}
