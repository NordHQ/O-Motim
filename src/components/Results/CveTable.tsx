import { type CveMatch } from "../../store/scanStore";

const SEV_COLOR: Record<string, string> = {
  Critical: "bg-severity-critical text-white",
  High: "bg-severity-high",
  Medium: "bg-severity-medium",
  Low: "bg-severity-low text-white",
  Info: "bg-severity-info",
};

export default function CveTable({ items }: { items: CveMatch[] }) {
  return (
    <div className="panel overflow-auto max-h-[calc(100vh-220px)]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">CVE</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">CVSS</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">Description</th>
            <th className="text-left px-3 py-2 text-text-muted text-xs font-medium">Affected</th>
          </tr>
        </thead>
        <tbody>
          {items.map((cve) => (
            <tr key={cve.cve_id} className="border-t border-border hover:bg-surface-raised transition-colors">
              <td className="px-3 py-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`severity-dot w-1.5 h-1.5 rounded-full ${SEV_COLOR[cve.severity]?.split(" ")[0] ?? "bg-text-muted"}`} />
                  <span className="font-mono text-text-primary text-xs">{cve.cve_id}</span>
                </span>
              </td>
              <td className="px-3 py-1.5 font-mono text-xs">
                <span className={cve.cvss_score >= 9 ? "text-severity-critical font-semibold" : cve.cvss_score >= 7 ? "text-severity-high" : "text-text-secondary"}>
                  {cve.cvss_score.toFixed(1)}
                </span>
              </td>
              <td className="px-3 py-1.5 text-text-secondary text-xs max-w-xs truncate">{cve.description}</td>
              <td className="px-3 py-1.5 text-text-muted text-xs">{cve.affected_tech}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-text-muted text-sm">
                No CVEs matched
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
