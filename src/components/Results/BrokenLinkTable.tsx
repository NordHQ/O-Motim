import type { BrokenLinkResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function statusBadge(status: string) {
  switch (status) {
    case "dead": return "bg-red-500/15 text-red-400";
    case "timeout": return "bg-yellow-500/15 text-yellow-400";
    case "error": return "bg-orange-500/15 text-orange-400";
    default: return "bg-surface-raised text-text-muted";
  }
}

interface Props { items: BrokenLinkResult[] }

export default function BrokenLinkTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No broken links detected.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Domain</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Pages</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-surface-raised/30 cursor-pointer"
              onClick={() => rescanRow(r.domain)}
              title={`Re-scan ${r.domain}`}
            >
              <td className="px-3 py-2 font-mono text-text-primary">{r.domain}</td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusBadge(r.status)}`}>
                  {r.status.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="space-y-0.5">
                  {r.pages.map((p, j) => (
                    <div key={j} className="font-mono text-text-secondary text-[10px] truncate max-w-[500px]">
                      {p}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
