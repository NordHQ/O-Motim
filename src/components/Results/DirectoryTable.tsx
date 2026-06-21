import type { DirectoryResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function statusColor(code: number) {
  if (code >= 200 && code < 300) return "text-green-400";
  if (code >= 300 && code < 400) return "text-yellow-400";
  if (code === 403) return "text-red-400";
  if (code === 401) return "text-orange-400";
  return "text-text-muted";
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

interface Props { items: DirectoryResult[] }

export default function DirectoryTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No directories found.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Path</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">URL</th>
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
              <td className="px-3 py-2 font-mono text-text-muted">{i + 1}</td>
              <td className="px-3 py-2 font-mono text-text-primary">{r.path}</td>
              <td className={`px-3 py-2 font-mono ${statusColor(r.status_code)}`}>{r.status_code}</td>
              <td className="px-3 py-2 font-mono text-text-secondary truncate max-w-[400px]">{r.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
