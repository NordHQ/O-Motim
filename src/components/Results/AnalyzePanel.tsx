import type { AnalyzeResult } from "../../store/scanStore";

function scoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function scoreBar(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

interface Props { items: AnalyzeResult[] }

export default function AnalyzePanel({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No host analysis.</p>;

  return (
    <div className="space-y-3">
      {items.map((r, i) => (
        <div key={i} className="panel p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-sm text-text-primary truncate">{r.url}</div>
              <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                <span>Status: <span className="font-mono text-text-secondary">{r.status}</span></span>
                <span>Title: <span className="text-text-secondary">{r.title || "—"}</span></span>
                <span>Server: <span className="font-mono text-text-secondary">{r.server || "—"}</span></span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className={`text-3xl font-bold ${scoreColor(r.score)}`}>{r.score}</div>
              <div className="text-[11px] text-text-muted">/ 100 · {scoreLabel(r.score)}</div>
            </div>
          </div>

          <div className="h-2 bg-surface-raised rounded-full overflow-hidden mb-3">
            <div className={`h-full ${scoreBar(r.score)} transition-all`} style={{ width: `${r.score}%` }} />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-1">
              <span className="text-text-muted">Links found</span>
              <span className="font-mono text-text-secondary">{r.links_count}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-1">
              <span className="text-text-muted">CSP</span>
              {r.has_csp ? <span className="text-green-400">✓ Present</span> : <span className="text-red-400">✗ Missing</span>}
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-1">
              <span className="text-text-muted">HSTS</span>
              {r.has_hsts ? <span className="text-green-400">✓ Present</span> : <span className="text-red-400">✗ Missing</span>}
            </div>
            <div className="flex items-center justify-between border-b border-border/50 pb-1">
              <span className="text-text-muted">Technologies</span>
              <span className="font-mono text-text-secondary">{r.tech.length}</span>
            </div>
          </div>

          {r.tech.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.tech.map((t, j) => (
                <span key={j} className="inline-flex items-center px-2 py-0.5 rounded bg-surface-raised text-[11px] font-mono text-purple-400">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
