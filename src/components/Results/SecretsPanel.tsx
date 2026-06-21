import { type Secret } from "../../store/scanStore";

const SEV_COLOR: Record<string, string> = {
  Critical: "text-severity-critical",
  High: "text-severity-high",
  Medium: "text-severity-medium",
  Low: "text-severity-low",
  Info: "text-severity-info",
};

export default function SecretsPanel({ items }: { items: Secret[] }) {
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={`${s.secret_type}-${s.location}-${i}`} className="panel p-3 flex items-start gap-3">
          <span className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${SEV_COLOR[s.severity] ?? "text-text-muted"}`}>
            {s.severity}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-text-primary">{s.secret_type}</div>
            <div className="text-xs text-text-secondary mt-0.5">
              <span className="font-mono bg-surface-raised px-1.5 py-0.5 rounded">
                {s.preview}
              </span>
            </div>
            <div className="text-[11px] text-text-muted mt-0.5 truncate">{s.location}</div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="panel p-6 text-center text-text-muted text-sm">
          No secrets found
        </div>
      )}
    </div>
  );
}
