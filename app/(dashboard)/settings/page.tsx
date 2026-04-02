import { PageHeader } from "@/components/layout/page-header";
import { SecondaryButton } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Basic configuration groups for system behavior, moderation, and release operations."
        title="Settings"
      />

      <section className="grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "Gameplay Config",
            description: "Difficulty tuning, reward scaling, and content release flags.",
          },
          {
            title: "Economy Controls",
            description: "Coin sinks, wallet safeguards, and pricing overrides.",
          },
          {
            title: "System Settings",
            description: "Authentication rules, staff roles, and audit placeholders.",
          },
        ].map((card) => (
          <div key={card.title} className="card rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{card.description}</p>
            <div className="mt-5 h-28 rounded-[24px] border border-dashed border-[var(--border-strong)] bg-slate-50" />
            <SecondaryButton className="mt-5">Configure</SecondaryButton>
          </div>
        ))}
      </section>
    </div>
  );
}
