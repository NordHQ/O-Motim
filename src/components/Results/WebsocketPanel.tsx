import type { WsResult } from "../../store/scanStore";

interface Props { items: WsResult[] }

export default function WebsocketPanel({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No WebSocket endpoints tested.</p>;

  const reachable = items.filter((r) => r.reachable);

  return (
    <div className="space-y-3">
      {reachable.length > 0 && (
        <div className="panel px-3 py-2 bg-green-500/5 border border-green-500/20">
          <span className="text-xs text-green-400 font-medium">
            ⚡ {reachable.length} reachable WebSocket endpoint{reachable.length > 1 ? "s" : ""} detected
          </span>
        </div>
      )}
      <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-surface">
            <tr className="border-b border-border text-text-muted text-left">
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">URL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={i} className={`border-b border-border/50 hover:bg-surface-raised/30 ${r.reachable ? "bg-green-500/5" : ""}`}>
                <td className="px-3 py-2">
                  {r.reachable ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/15 text-green-400 text-[11px] font-medium">
                      ⚡ OPEN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-raised text-text-muted text-[11px]">
                      CLOSED
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono text-text-primary">{r.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
