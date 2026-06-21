import { useScanStore } from "../../store/scanStore";
import TargetInput from "./TargetInput";
import QuickStats from "./QuickStats";
import {
  TriangleAlert,
  ShieldCheck,
  FileText,
  Sparkles,
  Bug,
  Network,
  KeyRound,
  Globe,
  Lock,
  Unplug,
} from "lucide-react";

export default function Dashboard() {
  const ctx = useScanStore((s) => s.context);
  const hasResults = !!ctx;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to <span className="text-accent">O'MOTIM</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          A modular reconnaissance pipeline — discovery, probing, fingerprinting,
          secret scanning, vulnerability hunting and CVE matching, all sharing one context.
        </p>
      </div>

      <TargetInput />

      {hasResults && (
        <>
          <QuickStats />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FindingCard
              icon={TriangleAlert}
              tone="critical"
              title="Critical CVEs"
              value={ctx!.summary.critical_count}
              hint={
                ctx!.summary.critical_count > 0
                  ? "Prioritise these for triage"
                  : "None detected"
              }
            />
            <FindingCard
              icon={ShieldCheck}
              tone="high"
              title="Header issues"
              value={ctx!.headers_analysis.length}
              hint="Security header findings"
            />
            <FindingCard
              icon={Bug}
              tone="critical"
              title="Backdoors"
              value={ctx!.backdoors.length}
              hint={
                ctx!.backdoors.length > 0
                  ? "Exposed sensitive files"
                  : "No backdoors detected"
              }
            />
            <FindingCard
              icon={Network}
              tone="high"
              title="CORS issues"
              value={ctx!.cors_results.filter((r) => r.vulnerable).length}
              hint="Misconfigured CORS origins"
            />
            <FindingCard
              icon={Unplug}
              tone="high"
              title="Open redirects"
              value={ctx!.open_redirects.filter((r) => r.vulnerable).length}
              hint="Redirect injection points"
            />
            <FindingCard
              icon={Lock}
              tone="medium"
              title="Dangerous methods"
              value={ctx!.http_methods.filter((r) => r.dangerous && r.status_code < 400).length}
              hint="PUT / DELETE / PATCH allowed"
            />
            <FindingCard
              icon={KeyRound}
              tone="high"
              title="Secrets"
              value={ctx!.secrets.length}
              hint="Keys & tokens in responses"
            />
            <FindingCard
              icon={Sparkles}
              tone="info"
              title="Technologies"
              value={ctx!.technologies.length}
              hint="Fingerprinted across hosts"
            />
            <FindingCard
              icon={FileText}
              tone="low"
              title="Subdomains"
              value={ctx!.subdomains.length}
              hint="Discovered targets"
            />
            <FindingCard
              icon={Globe}
              tone="info"
              title="API endpoints"
              value={ctx!.api_endpoints.length}
              hint="Discovered & brute-forced"
            />
            <FindingCard
              icon={Bug}
              tone="medium"
              title="Broken links"
              value={ctx!.broken_links.length}
              hint="Dead external domains"
            />
            <FindingCard
              icon={Sparkles}
              tone="info"
              title="Directories"
              value={ctx!.directories.length}
              hint="Discovered paths"
            />
          </div>
        </>
      )}

      {!hasResults && (
        <div className="panel p-8 text-center">
          <div className="text-text-muted text-sm">
            Enter a target domain above to launch the pipeline.
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            {[
              { n: "1", t: "Recon", d: "Subdomains, DNS, HTTP probe" },
              { n: "2", t: "Fingerprint", d: "Tech, headers, secrets" },
              { n: "3", t: "Vuln hunt", d: "Backdoors, CORS, methods, SSL" },
              { n: "4", t: "Deep scan", d: "API, forms, crawl, WS" },
            ].map((s) => (
              <div key={s.n} className="panel p-3">
                <div className="text-accent text-xs font-mono">STEP {s.n}</div>
                <div className="text-sm text-text-primary mt-1">{s.t}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FindingCard({
  icon: Icon,
  title,
  value,
  hint,
  tone,
}: {
  icon: typeof TriangleAlert;
  title: string;
  value: number;
  hint: string;
  tone: "critical" | "high" | "medium" | "low" | "info";
}) {
  const toneColor =
    tone === "critical"
      ? "text-severity-critical"
      : tone === "high"
        ? "text-severity-high"
        : tone === "medium"
          ? "text-severity-medium"
          : tone === "low"
            ? "text-severity-low"
            : "text-severity-info";

  return (
    <div className="panel p-4 flex items-center gap-4">
      <Icon className={`w-8 h-8 shrink-0 ${toneColor}`} />
      <div className="min-w-0">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-text-secondary">{title}</div>
        <div className="text-[11px] text-text-muted truncate">{hint}</div>
      </div>
    </div>
  );
}
