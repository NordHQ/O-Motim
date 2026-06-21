import { useScanStore } from "../../store/scanStore";
import { useState } from "react";
import ExportPanel from "./ExportPanel";

export default function ReportPreview() {
  const ctx = useScanStore((s) => s.context);
  const [showExport, setShowExport] = useState(false);

  if (!ctx) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 text-text-muted text-sm">
        No scan results to report. Run a scan first.
      </div>
    );
  }

  const s = ctx.summary;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Report — {ctx.domain}</h2>
          <p className="text-xs text-text-muted">
            {new Date().toLocaleDateString()} · {s.elapsed_secs}s elapsed
          </p>
        </div>
        <button onClick={() => setShowExport(!showExport)} className="btn-ghost text-xs">
          {showExport ? "Hide" : "Show"} Export
        </button>
      </div>

      {showExport && <ExportPanel />}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Subdomains", value: s.total_subdomains, color: "" },
          { label: "Alive", value: s.alive_hosts, color: "text-severity-success" },
          { label: "Critical CVEs", value: s.critical_count, color: "text-severity-critical" },
          { label: "Secrets", value: s.secrets_found, color: "text-severity-high" },
          { label: "High", value: s.high_count, color: "text-severity-high" },
          { label: "Medium", value: s.medium_count, color: "text-severity-medium" },
          { label: "Low", value: s.low_count, color: "text-severity-low" },
          { label: "Technologies", value: ctx.technologies.length, color: "" },
        ].map((c) => (
          <div key={c.label} className="panel p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-text-muted">{c.label}</div>
            <div className={`text-xl font-semibold mt-1 ${c.color || "text-text-primary"}`}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Top CVEs */}
      {ctx.cves.length > 0 && (
        <div className="panel p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Top CVEs</h3>
          <div className="space-y-2">
            {ctx.cves.slice(0, 5).map((cve) => (
              <div key={cve.cve_id} className="flex items-start gap-3 text-xs">
                <span className={`font-mono font-bold ${cve.cvss_score >= 9 ? "text-severity-critical" : cve.cvss_score >= 7 ? "text-severity-high" : "text-severity-medium"}`}>
                  {cve.cvss_score.toFixed(1)}
                </span>
                <div>
                  <span className="font-mono text-text-primary">{cve.cve_id}</span>
                  <span className="text-text-muted ml-2">{cve.description.slice(0, 120)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top secrets */}
      {ctx.secrets.length > 0 && (
        <div className="panel p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Exposed Secrets</h3>
          <div className="space-y-2">
            {ctx.secrets.slice(0, 5).map((s, i) => (
              <div key={`${s.secret_type}-${i}`} className="flex items-center gap-3 text-xs">
                <span className={`${s.severity === "Critical" ? "text-severity-critical" : s.severity === "High" ? "text-severity-high" : "text-severity-medium"} font-medium`}>
                  {s.severity}
                </span>
                <span className="text-text-primary">{s.secret_type}</span>
                <span className="font-mono text-text-muted">{s.preview}</span>
                <span className="text-text-muted truncate">{s.location}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header issues */}
      {ctx.headers_analysis.length > 0 && (
        <div className="panel p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Header Issues</h3>
          <div className="space-y-1.5">
            {ctx.headers_analysis.slice(0, 10).map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className={`${h.severity === "High" ? "text-severity-high" : h.severity === "Medium" ? "text-severity-medium" : "text-severity-low"} font-medium min-w-[60px]`}>
                  {h.severity}
                </span>
                <span className="text-text-primary">{h.issue}</span>
                <span className="text-text-muted truncate flex-1">{h.url}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
