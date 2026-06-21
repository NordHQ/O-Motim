import type { BackdoorResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function sevColor(s: string) {
  switch (s) {
    case "CRITICAL": return "bg-severity-critical";
    case "HIGH": return "bg-severity-high";
    case "MEDIUM": return "bg-severity-medium";
    case "LOW": return "bg-severity-low";
    default: return "bg-text-muted";
  }
}

/** URL'dan domain olish — re-scan uchun. */
function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

interface Props { items: BackdoorResult[] }

export default function BackdoorTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No exposed files found.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Severity</th>
            <th className="px-3 py-2">Path</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-surface-raised/30 cursor-pointer"
              onClick={() => rescanRow(extractDomain(r.url))}
              title={`Re-scan ${extractDomain(r.url)}`}
            >
              <td className="px-3 py-2">
                <span className={`severity-dot ${sevColor(r.severity)}`} />
                <span className="ml-1.5 text-text-secondary">{r.severity}</span>
              </td>
              <td className="px-3 py-2 font-mono text-text-primary">{r.path}</td>
              <td className="px-3 py-2 text-text-secondary">{r.description}</td>
              <td className="px-3 py-2 font-mono text-text-secondary">{r.status_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
