import { type HttpResult } from "../../store/scanStore";

function statusColor(code: number): string {
  if (code >= 200 && code < 300) return "text-severity-success";
  if (code >= 300 && code < 400) return "text-severity-info";
  if (code >= 400 && code < 500) return "text-severity-medium";
  return "text-severity-critical";
}

export default function HttpResults({ items }: { items: HttpResult[] }) {
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">URL</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium w-16">Status</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">Title</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium w-20">Time</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">Server</th>
          </tr>
        </thead>
        <tbody>
          {items.map((h) => (
            <tr key={h.url} className="border-t border-border hover:bg-surface-raised transition-colors">
              <td className="px-3 py-1.5 font-mono text-xs text-text-primary truncate max-w-xs">{h.url}</td>
              <td className={`px-3 py-1.5 font-mono text-xs font-semibold ${statusColor(h.status)}`}>
                {h.status}
              </td>
              <td className="px-3 py-1.5 text-xs text-text-secondary truncate max-w-xs">{h.title}</td>
              <td className="px-3 py-1.5 font-mono text-xs text-text-muted">{h.response_time_ms}ms</td>
              <td className="px-3 py-1.5 text-xs text-text-muted truncate">{h.server ?? "—"}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-text-muted text-sm">
                No HTTP results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
