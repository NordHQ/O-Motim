import type { CrawlResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function statusColor(code: number) {
  if (code === 0) return "text-text-muted";
  if (code >= 200 && code < 300) return "text-green-400";
  if (code >= 300 && code < 400) return "text-yellow-400";
  if (code >= 400) return "text-red-400";
  return "text-text-muted";
}

function typeColor(t: string) {
  switch (t) {
    case "text/html": return "text-blue-400";
    case "application/json": return "text-green-400";
    case "text/css": return "text-purple-400";
    case "application/javascript": return "text-yellow-400";
    default: return "text-text-muted";
  }
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

interface Props { items: CrawlResult[] }

export default function CrawlTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No pages crawled.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Depth</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">URL</th>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Type</th>
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
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-surface-raised text-[10px] font-mono text-text-muted">
                  {r.depth}
                </span>
              </td>
              <td className={`px-3 py-2 font-mono ${statusColor(r.status_code)}`}>{r.status_code || "—"}</td>
              <td className="px-3 py-2 font-mono text-text-primary truncate max-w-[300px]">{r.url}</td>
              <td className="px-3 py-2 text-text-secondary truncate max-w-[200px]">{r.title || "—"}</td>
              <td className={`px-3 py-2 font-mono text-[11px] ${typeColor(r.content_type)}`}>
                {r.content_type || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
