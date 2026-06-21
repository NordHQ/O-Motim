import { type Technology } from "../../store/scanStore";

export default function TechCards({ items }: { items: Technology[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((t) => (
        <div key={`${t.name}-${t.version ?? ""}`} className="panel p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">{t.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-raised text-text-muted">
              {t.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-secondary">
            <span>{t.version ?? "—"}</span>
            <span className="text-text-muted">{t.confidence}%</span>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-3 panel p-6 text-center text-text-muted text-sm">
          No technologies detected
        </div>
      )}
    </div>
  );
}
