import { useScanStore } from "../../store/scanStore";
import { Download, FileJson, FileText } from "lucide-react";

export default function ExportPanel() {
  const ctx = useScanStore((s) => s.context);

  if (!ctx) return null;

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(ctx, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ctx.domain.replace(/\./g, "_")}_report.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportHTML = () => {
    const html = buildReportHTML(ctx);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ctx.domain.replace(/\./g, "_")}_report.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="panel p-4 flex items-center gap-3">
      <button onClick={exportJSON} className="btn-ghost text-xs flex items-center gap-1.5">
        <FileJson className="w-3.5 h-3.5" />
        Export JSON
      </button>
      <button onClick={exportHTML} className="btn-ghost text-xs flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5" />
        Export HTML
      </button>
      <span className="text-[11px] text-text-muted ml-auto">
        <Download className="w-3 h-3 inline mr-1" />
        Download saved by backend
      </span>
    </div>
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function buildReportHTML(ctx: ReturnType<typeof useScanStore.getState>["context"]): string {
  if (!ctx) return "";
  const s = ctx.summary;
  const date = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  const subRows = ctx.subdomains.map((d) => `<tr><td>${esc(d)}</td></tr>`).join("");
  const techRows = ctx.technologies
    .map((t) => `<tr><td>${esc(t.name)}</td><td>${esc(t.category)}</td><td>${esc(t.version ?? "—")}</td><td>${t.confidence}%</td></tr>`)
    .join("");
  const cveRows = ctx.cves
    .map((c) => `<tr><td>${esc(c.cve_id)}</td><td>${c.cvss_score.toFixed(1)}</td><td>${esc(c.description.slice(0, 200))}</td><td>${esc(c.affected_tech)}</td></tr>`)
    .join("");
  const secRows = ctx.secrets
    .map((s) => `<tr><td>${esc(s.secret_type)}</td><td>${esc(s.preview)}</td><td>${esc(s.location)}</td></tr>`)
    .join("");
  const httpRows = ctx.http_results
    .map((h) => `<tr><td>${esc(h.url)}</td><td>${h.status}</td><td>${esc(h.title)}</td><td>${h.response_time_ms}ms</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>O'MOTIM — ${esc(ctx.domain)}</title>
<style>
:root{--bg:#08080f;--surface:#0e0e1a;--border:#1f1f30;--accent:#c84b0e;--text:#f0f0f5;--muted:#7a7a99}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;padding:32px}
h1{margin:0;font-size:28px}.h2{font-size:16px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin:32px 0 12px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px 16px}
.card .label{color:var(--muted);font-size:11px;text-transform:uppercase}.card .value{font-size:24px;font-weight:600;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;color:var(--muted);padding:8px 10px;border-bottom:1px solid var(--border)}
td{padding:8px 10px;border-bottom:1px solid var(--border)}tr:hover td{background:var(--surface)}
footer{margin-top:40px;color:var(--muted);font-size:11px;text-align:center}
</style></head><body>
<header><h1><span style="color:var(--accent)">◈</span> O'MOTIM Report</h1>
<div style="color:var(--muted);font-size:13px;margin-top:4px">Target: <strong>${esc(ctx.domain)}</strong> · ${date} · ${s.elapsed_secs}s</div></header>
<section><h2 class="h2">Summary</h2><div class="grid">
<div class="card"><div class="label">Subdomains</div><div class="value">${s.total_subdomains}</div></div>
<div class="card"><div class="label">Alive</div><div class="value">${s.alive_hosts}</div></div>
<div class="card"><div class="label">Critical CVEs</div><div class="value" style="color:#ff3333">${s.critical_count}</div></div>
<div class="card"><div class="label">Secrets</div><div class="value" style="color:#ff7700">${s.secrets_found}</div></div>
</div></section>
<section><h2 class="h2">Subdomains</h2><table><thead><tr><th>Hostname</th></tr></thead><tbody>${subRows}</tbody></table></section>
<section><h2 class="h2">Technologies</h2><table><thead><tr><th>Name</th><th>Category</th><th>Version</th><th>Confidence</th></tr></thead><tbody>${techRows}</tbody></table></section>
<section><h2 class="h2">HTTP Probe</h2><table><thead><tr><th>URL</th><th>Status</th><th>Title</th><th>Time</th></tr></thead><tbody>${httpRows}</tbody></table></section>
<section><h2 class="h2">CVE Matches</h2><table><thead><tr><th>CVE</th><th>CVSS</th><th>Description</th><th>Affected</th></tr></thead><tbody>${cveRows}</tbody></table></section>
<section><h2 class="h2">Secrets</h2><table><thead><tr><th>Type</th><th>Preview</th><th>Location</th></tr></thead><tbody>${secRows}</tbody></table></section>
<footer>Generated by O'MOTIM — for authorized security testing only.</footer>
</body></html>`;
}
