export function LoadingTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="animate-pulse space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-3">
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
