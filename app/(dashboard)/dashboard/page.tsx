import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PageHeader } from "@/components/layout/page-header";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        description="Monitor platform health, staff activity, and key operational metrics in one place."
        title="Dashboard"
      />
      <DashboardOverview />
    </div>
  );
}
