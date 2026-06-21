import type { OpenRedirectResult } from "../../store/scanStore";

interface Props { items: OpenRedirectResult[] }

export default function RedirectTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No open redirect vulnerabilities found.</p>;

  const vuln = items.filter((r) => r.vulnerable);
  const safe = items.filter((r) => !r.vulnerable);

  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      {vuln.length > 0 && (
        <>
          <div className="px-3 py-2 border-b border-border bg-red-500/5">
            <span className="text-xs text-red-400 font-medium">{vuln.length} Vulnerable</span>
          </div>
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-border text-text-muted text-left">
                <th className="px-3 py-2">Param</th>
                <th className="px-3 py-2">Payload Type</th>
                <th className="px-3 py-2">Payload</th>
                <th className="px-3 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {vuln.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface-raised/30 bg-red-500/5">
                  <td className="px-3 py-2 font-mono text-text-primary">{r.parameter}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.payload_type}</td>
                  <td className="px-3 py-2 font-mono text-text-secondary truncate max-w-[300px]">{r.payload}</td>
                  <td className="px-3 py-2 font-mono text-red-400 truncate max-w-[250px]">{r.redirect_location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {safe.length > 0 && (
        <>
          <div className="px-3 py-2 border-b border-border">
            <span className="text-xs text-text-muted font-medium">{safe.length} Safe (tested)</span>
          </div>
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-border text-text-muted text-left">
                <th className="px-3 py-2">Param</th>
                <th className="px-3 py-2">Payload Type</th>
                <th className="px-3 py-2">Payload</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {safe.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-surface-raised/30">
                  <td className="px-3 py-2 font-mono text-text-primary">{r.parameter}</td>
                  <td className="px-3 py-2 text-text-secondary">{r.payload_type}</td>
                  <td className="px-3 py-2 font-mono text-text-secondary truncate max-w-[300px]">{r.payload}</td>
                  <td className="px-3 py-2">
                    <span className="text-green-400 text-[11px]">SAFE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
