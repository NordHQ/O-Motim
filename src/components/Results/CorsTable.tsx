import type { CorsResult } from "../../store/scanStore";

interface Props { items: CorsResult[] }

export default function CorsTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No CORS misconfigurations found.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">Origin</th>
            <th className="px-3 py-2">Allow-Origin</th>
            <th className="px-3 py-2">Credentials</th>
            <th className="px-3 py-2">Vulnerable</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={i} className={`border-b border-border/50 hover:bg-surface-raised/30 ${r.vulnerable ? "bg-red-500/5" : ""}`}>
              <td className="px-3 py-2 font-mono text-text-primary">{r.origin}</td>
              <td className="px-3 py-2 font-mono text-text-secondary">{r.allow_origin || "—"}</td>
              <td className="px-3 py-2">
                {r.allow_credentials ? (
                  <span className="text-red-400">✓ Yes</span>
                ) : (
                  <span className="text-text-muted">No</span>
                )}
              </td>
              <td className="px-3 py-2">
                {r.vulnerable ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[11px] font-medium">
                    VULNERABLE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/15 text-green-400 text-[11px] font-medium">
                    SAFE
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
