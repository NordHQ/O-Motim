import type { SslResult } from "../../store/scanStore";

interface Props { items: SslResult[] }

export default function SslPanel({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No SSL results.</p>;

  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-text-muted text-left">
            <th className="px-3 py-2">URL</th>
            <th className="px-3 py-2">HTTPS</th>
            <th className="px-3 py-2">Redirect</th>
            <th className="px-3 py-2">HSTS</th>
            <th className="px-3 py-2">CSP</th>
            <th className="px-3 py-2">X-Frame</th>
            <th className="px-3 py-2">X-CTO</th>
            <th className="px-3 py-2">Referrer</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-surface-raised/30">
              <td className="px-3 py-2 font-mono text-text-primary truncate max-w-[250px]">{r.url}</td>
              <td className="px-3 py-2">{r.https_active ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
              <td className="px-3 py-2">{r.http_to_https_redirect ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
              <td className="px-3 py-2">
                {r.hsts ? (
                  <span className="text-green-400" title={r.hsts_value || ""}>✓</span>
                ) : (
                  <span className="text-red-400">✗</span>
                )}
              </td>
              <td className="px-3 py-2">{r.has_csp ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
              <td className="px-3 py-2">{r.has_x_frame_options ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
              <td className="px-3 py-2">{r.has_x_content_type_options ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
              <td className="px-3 py-2">{r.has_referrer_policy ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
