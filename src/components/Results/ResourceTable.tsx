import type { ResourceResult } from "../../store/scanStore";
import { rescanRow } from "../../utils/rescan";

function typeColor(t: string) {
  switch (t) {
    case "image": return "bg-blue-500/15 text-blue-400";
    case "script": return "bg-yellow-500/15 text-yellow-400";
    case "style": return "bg-purple-500/15 text-purple-400";
    case "font": return "bg-pink-500/15 text-pink-400";
    case "media": return "bg-green-500/15 text-green-400";
    default: return "bg-surface-raised text-text-muted";
  }
}

function typeIcon(t: string) {
  switch (t) {
    case "image": return "🖼";
    case "script": return "📜";
    case "style": return "🎨";
    case "font": return "🔤";
    case "media": return "🎬";
    default: return "📎";
  }
}

function formatSize(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

interface Props { items: ResourceResult[] }

export default function ResourceTable({ items }: Props) {
  if (items.length === 0) return <p className="text-text-muted text-sm">No resources enumerated.</p>;

  // type bo'yicha guruhlab sanaymiz
  const typeCounts = items.reduce<Record<string, number>>((acc, r) => {
    acc[r.resource_type] = (acc[r.resource_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeCounts).map(([t, c]) => (
          <span key={t} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono ${typeColor(t)}`}>
            <span>{typeIcon(t)}</span>
            <span className="uppercase">{t}</span>
            <span className="opacity-70">{c}</span>
          </span>
        ))}
      </div>
      <div className="panel overflow-auto max-h-[calc(100vh-260px)]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-surface">
            <tr className="border-b border-border text-text-muted text-left">
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">URL</th>
              <th className="px-3 py-2 text-right">Size</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-surface-raised/30 cursor-pointer"
                  onClick={() => rescanRow(extractDomain(r.url))}
                  title={`Re-scan ${extractDomain(r.url)}`}>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${typeColor(r.resource_type)}`}>
                    {typeIcon(r.resource_type)} {r.resource_type}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-text-primary truncate max-w-[450px]">{r.url}</td>
                <td className="px-3 py-2 font-mono text-text-secondary text-right whitespace-nowrap">
                  {formatSize(r.size)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
