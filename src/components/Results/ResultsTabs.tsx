import { useState } from "react";
import { useScanStore, type ScanContext } from "../../store/scanStore";
import SubdomainTable from "./SubdomainTable";
import TechCards from "./TechCards";
import CveTable from "./CveTable";
import SecretsPanel from "./SecretsPanel";
import HttpResults from "./HttpResults";
import BackdoorTable from "./BackdoorTable";
import DirectoryTable from "./DirectoryTable";
import CorsTable from "./CorsTable";
import MethodsTable from "./MethodsTable";
import SslPanel from "./SslPanel";
import RedirectTable from "./RedirectTable";
import ApiTable from "./ApiTable";
import FormPanel from "./FormPanel";
import BrokenLinkTable from "./BrokenLinkTable";
import HeaderDumpPanel from "./HeaderDumpPanel";
import CrawlTable from "./CrawlTable";
import ResourceTable from "./ResourceTable";
import WebsocketPanel from "./WebsocketPanel";
import AnalyzePanel from "./AnalyzePanel";
import SecurityProbePanel from "./SecurityProbePanel";

const TABS = [
  { id: "subdomains", label: "Subdomains" },
  { id: "http", label: "HTTP Probe" },
  { id: "tech", label: "Tech" },
  { id: "headers", label: "Headers" },
  { id: "secrets", label: "Secrets" },
  { id: "cves", label: "CVEs" },
  { id: "backdoors", label: "Backdoors" },
  { id: "directories", label: "Dirs" },
  { id: "cors", label: "CORS" },
  { id: "methods", label: "Methods" },
  { id: "ssl", label: "SSL" },
  { id: "redirects", label: "Redirects" },
  { id: "api", label: "API" },
  { id: "forms", label: "Forms" },
  { id: "broken", label: "Broken" },
  { id: "headers_dump", label: "Header Dump" },
  { id: "crawl", label: "Crawl" },
  { id: "resources", label: "Resources" },
  { id: "ws", label: "WebSocket" },
  { id: "analyze", label: "Analyze" },
  { id: "security", label: "Security" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getCount(id: TabId, ctx: ScanContext): number {
  switch (id) {
    case "subdomains": return ctx.subdomains.length;
    case "http": return ctx.http_results.length;
    case "tech": return ctx.technologies.length;
    case "headers": return ctx.headers_analysis.length;
    case "secrets": return ctx.secrets.length;
    case "cves": return ctx.cves.length;
    case "backdoors": return ctx.backdoors.length;
    case "directories": return ctx.directories.length;
    case "cors": return ctx.cors_results.length;
    case "methods": return ctx.http_methods.length;
    case "ssl": return ctx.ssl_results.length;
    case "redirects": return ctx.open_redirects.length;
    case "api": return ctx.api_endpoints.length;
    case "forms": return ctx.forms.length;
    case "broken": return ctx.broken_links.length;
    case "headers_dump": return ctx.header_dumps.length;
    case "crawl": return ctx.crawl_results.length;
    case "resources": return ctx.resources.length;
    case "ws": return ctx.ws_results.length;
    case "analyze": return ctx.analyze_results.length;
    case "security": return ctx.security_probes.length;
    default: return 0;
  }
}

export default function ResultsTabs() {
  const [tab, setTab] = useState<TabId>("subdomains");
  const ctx = useScanStore((s) => s.context);

  if (!ctx) {
    return (
      <div className="text-center text-text-muted py-20">
        No scan results yet. Run a scan first.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-1 border-b border-border mb-4 overflow-x-auto">
        {TABS.map((t) => {
          const count = getCount(t.id, ctx);
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-sm border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className="ml-1.5 text-[11px] font-mono text-text-muted">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        {tab === "subdomains" && <SubdomainTable items={ctx.subdomains} />}
        {tab === "http" && <HttpResults items={ctx.http_results} />}
        {tab === "tech" && <TechCards items={ctx.technologies} />}
        {tab === "headers" && <SubdomainTable items={ctx.headers_analysis.map((h) => `${h.issue} — ${h.url}`)} />}
        {tab === "secrets" && <SecretsPanel items={ctx.secrets} />}
        {tab === "cves" && <CveTable items={ctx.cves} />}
        {tab === "backdoors" && <BackdoorTable items={ctx.backdoors} />}
        {tab === "directories" && <DirectoryTable items={ctx.directories} />}
        {tab === "cors" && <CorsTable items={ctx.cors_results} />}
        {tab === "methods" && <MethodsTable items={ctx.http_methods} />}
        {tab === "ssl" && <SslPanel items={ctx.ssl_results} />}
        {tab === "redirects" && <RedirectTable items={ctx.open_redirects} />}
        {tab === "api" && <ApiTable items={ctx.api_endpoints} />}
        {tab === "forms" && <FormPanel items={ctx.forms} />}
        {tab === "broken" && <BrokenLinkTable items={ctx.broken_links} />}
        {tab === "headers_dump" && <HeaderDumpPanel items={ctx.header_dumps} />}
        {tab === "crawl" && <CrawlTable items={ctx.crawl_results} />}
        {tab === "resources" && <ResourceTable items={ctx.resources} />}
        {tab === "ws" && <WebsocketPanel items={ctx.ws_results} />}
        {tab === "analyze" && <AnalyzePanel items={ctx.analyze_results} />}
        {tab === "security" && <SecurityProbePanel items={ctx.security_probes} />}
      </div>
    </div>
  );
}
