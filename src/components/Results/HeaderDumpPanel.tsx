import { useState } from "react";
import type { HeaderDumpResult } from "../../store/scanStore";

const SECURITY_HEADERS = new Set([
  "content-security-policy",
  "strict-transport-security",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-xss-protection",
  "x-permitted-cross-domain-policies",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
]);

interface Props { items: HeaderDumpResult[] }

export default function HeaderDumpPanel({ items }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  if (items.length === 0) return <p className="text-text-muted text-sm">No headers dumped.</p>;

  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <div className="divide-y divide-border">
        {items.map((r, i) => {
          const isOpen = expanded === i;
          const secCount = r.headers.filter(([k]) => SECURITY_HEADERS.has(k.toLowerCase())).length;
          return (
            <div key={i}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-surface-raised/30 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-text-muted text-xs">{isOpen ? "▼" : "▶"}</span>
                  <span className="font-mono text-xs text-text-primary truncate max-w-[400px]">{r.url}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-text-muted">{r.headers.length} headers</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    secCount > 0 ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {secCount}/{SECURITY_HEADERS.size} sec
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-1">
                  <table className="w-full text-xs">
                    <tbody>
                      {r.headers.map(([k, v], j) => {
                        const isSec = SECURITY_HEADERS.has(k.toLowerCase());
                        return (
                          <tr key={j} className={`border-b border-border/30 ${isSec ? "bg-green-500/5" : ""}`}>
                            <td className="py-1.5 pr-3 font-mono text-text-secondary whitespace-nowrap align-top w-1/3">
                              {isSec && <span className="text-green-400 mr-1">🔒</span>}
                              {k}
                            </td>
                            <td className="py-1.5 font-mono text-text-muted break-all">{v}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
