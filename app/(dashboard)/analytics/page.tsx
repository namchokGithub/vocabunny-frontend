import { PageHeader } from "@/components/layout/page-header";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Placeholder analytics surfaces for event volume, funnels, and experiment tracking."
        title="Analytics"
      />

      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {["DAU", "Session Length", "Quest Completion", "ARPU"].map((metric) => (
          <div key={metric} className="card rounded-[28px] p-5">
            <p className="text-sm font-medium text-slate-500">{metric}</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">--</p>
            <div className="mt-6 h-20 rounded-2xl bg-slate-100" />
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {["Event Stream", "Top Funnels", "Experiment Results"].map((card) => (
          <div key={card} className="card rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-slate-950">{card}</h3>
            <div className="mt-4 h-56 rounded-[24px] border border-dashed border-[var(--border-strong)] bg-slate-50" />
          </div>
        ))}
      </section>
    </div>
  );
}
