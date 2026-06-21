import type { HttpMethodResult } from "../../store/scanStore";

interface Props { items: HttpMethodResult[] }

export default function MethodsTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No methods tested.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Method</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Dangerous</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={i} className={`border-b border-border/50 hover:bg-surface-raised/30 ${r.dangerous && r.status_code < 400 ? "bg-red-500/5" : ""}`}>
              <td className="px-3 py-2">
                <span className={`font-mono font-bold ${r.dangerous && r.status_code < 400 ? "text-red-400" : "text-text-primary"}`}>
                  {r.method}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-text-secondary">{r.status_code}</td>
              <td className="px-3 py-2">
                {r.dangerous && r.status_code < 400 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[11px] font-medium">
                    DANGEROUS
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
