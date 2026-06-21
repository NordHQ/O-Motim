import { rescanRow } from "../../utils/rescan";

export default function SubdomainTable({ items }: { items: string[] }) {
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">#</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">Hostname</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className="border-t border-border hover:bg-surface-raised transition-colors cursor-pointer"
              onClick={() => rescanRow(item)}
              title={`Re-scan ${item}`}
            >
              <td className="px-3 py-1.5 text-text-muted font-mono text-xs">{i + 1}</td>
              <td className="px-3 py-1.5 font-mono text-text-primary">{item}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={2} className="px-3 py-6 text-center text-text-muted text-sm">
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
