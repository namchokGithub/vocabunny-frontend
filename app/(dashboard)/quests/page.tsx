"use client";

import { PageHeader } from "@/components/layout/page-header";
import { questColumns } from "@/components/operations/column-definitions";
import { DataTable } from "@/components/table/data-table";
import { LoadingTable } from "@/components/table/loading-table";
import { PrimaryButton } from "@/components/ui/button";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { questsApi } from "@/lib/api";

export default function QuestsPage() {
  const { data, isLoading } = useAsyncData(questsApi.getQuestDefinitions);

  return (
    <div>
      <PageHeader
        actions={<PrimaryButton>Create Quest</PrimaryButton>}
        description="Configure quest definitions, rewards, and availability windows for live operations."
        title="Quests"
      />
      {isLoading ? <LoadingTable /> : <DataTable columns={questColumns} rows={data ?? []} />}
    </div>
  );
}
