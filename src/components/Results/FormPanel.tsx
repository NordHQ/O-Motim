import type { FormResult } from "../../store/scanStore";

function typeColor(t: string) {
  switch (t) {
    case "login": return "bg-red-500/15 text-red-400";
    case "search": return "bg-blue-500/15 text-blue-400";
    case "contact": return "bg-green-500/15 text-green-400";
    case "comment": return "bg-yellow-500/15 text-yellow-400";
    default: return "bg-surface-raised text-text-secondary";
  }
}

interface Props { items: FormResult[] }

export default function FormPanel({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No forms found.</p>;
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <div className="divide-y divide-border">
        {items.map((r, i) => (
          <div key={i} className="px-3 py-3 hover:bg-surface-raised/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${typeColor(r.form_type)}`}>
                {r.form_type.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 rounded bg-surface-raised text-[11px] font-mono text-text-secondary`}>
                {r.form_method.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-text-primary truncate max-w-[400px]">
                {r.action}
              </span>
            </div>
            {r.fields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 ml-1">
                {r.fields.map((f, j) => (
                  <span key={j} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    f.has_password ? "bg-red-500/10 text-red-400" : "bg-surface-raised text-text-muted"
                  }`}>
                    {f.has_password && <span>🔒</span>}
                    {f.name}
                    <span className="text-text-muted">({f.field_type})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
