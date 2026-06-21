import type { ApiEndpointResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function methodColor(method: string) {
  switch (method.toUpperCase()) {
    case "GET": return "text-green-400";
    case "POST": return "text-yellow-400";
    case "PUT": return "text-blue-400";
    case "DELETE": return "text-red-400";
    case "PATCH": return "text-purple-400";
    default: return "text-text-secondary";
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

interface Props { items: ApiEndpointResult[] }

export default function ApiTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No API endpoints discovered.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Method</th>
            <th className="px-3 py-2">Path</th>
            <th className="px-3 py-2">Params</th>
            <th className="px-3 py-2">Found In</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border/50 hover:bg-surface-raised/30 cursor-pointer"
              onClick={() => rescanRow(extractDomain(r.found_in))}
              title={`Re-scan ${extractDomain(r.found_in)}`}
            >
              <td className="px-3 py-2">
                <span className={`font-mono font-bold ${methodColor(r.method)}`}>
                  {r.method.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-text-primary">{r.path}</td>
              <td className="px-3 py-2 text-text-secondary">
                {r.params.length > 0 ? (
                  <span className="space-x-1">
                    {r.params.map((p, j) => (
                      <span key={j} className="inline-block px-1.5 py-0.5 rounded bg-surface-raised text-[10px] font-mono">
                        {p}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
              <td className="px-3 py-2 text-text-secondary truncate max-w-[200px]">{r.found_in}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
