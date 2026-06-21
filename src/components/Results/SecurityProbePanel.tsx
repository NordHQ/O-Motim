import type { SecurityProbeResult } from "../../store/scanStore";

function gradeColor(grade: string) {
  switch (grade[0]) {
    case "A": return "text-green-400 border-green-500/40 bg-green-500/10";
    case "B": return "text-lime-400 border-lime-500/40 bg-lime-500/10";
    case "C": return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
    case "D": return "text-orange-400 border-orange-500/40 bg-orange-500/10";
    case "F": return "text-red-400 border-red-500/40 bg-red-500/10";
    default: return "text-text-muted border-border bg-surface-raised";
  }
}

interface Props { items: SecurityProbeResult[] }

export default function SecurityProbePanel({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No security probes run.</p>;

  return (
    <div className="space-y-3">
      {items.map((r, i) => (
        <div key={i} className="panel p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className={`shrink-0 w-16 h-16 rounded-lg border-2 flex items-center justify-center ${gradeColor(r.grade)}`}>
              <span className="text-3xl font-bold">{r.grade}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-sm text-text-primary truncate">{r.url}</div>
              <div className="text-xs text-text-muted mt-0.5">
                Score: <span className="font-mono text-text-secondary">{r.score}</span> ·
                Findings: <span className="font-mono text-text-secondary">{r.findings.length}</span>
              </div>
              <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, r.score))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {r.findings.map((f, j) => (
              <div
                key={j}
                className={`flex items-center justify-between px-2 py-1.5 rounded text-xs ${
                  f.present ? "bg-green-500/5" : f.points > 5 ? "bg-red-500/5" : "bg-yellow-500/5"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {f.present ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className={f.points > 5 ? "text-red-400" : "text-yellow-400"}>✗</span>
                  )}
                  <span className="font-mono text-text-secondary truncate">{f.header}</span>
                  {f.value && (
                    <span className="font-mono text-text-muted text-[10px] truncate max-w-[200px]">{f.value}</span>
                  )}
                </div>
                <span className={`font-mono text-[11px] shrink-0 ml-2 ${
                  f.present ? "text-green-400" : f.points > 5 ? "text-red-400" : "text-yellow-400"
                }`}>
                  {f.present ? `+${f.points}` : `-${f.points}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
