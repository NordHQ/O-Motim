import { useScanStore } from "../../store/scanStore";
import { Globe, Radio, Bug, KeyRound } from "lucide-react";

export default function QuickStats() {
  const ctx = useScanStore((s) => s.context);

  // vulnerability sonlari — yangi parasite operatsiyalaridan
  const vulnCount =
    (ctx?.backdoors.length ?? 0) +
    (ctx?.cors_results.filter((r) => r.vulnerable).length ?? 0) +
    (ctx?.http_methods.filter((r) => r.dangerous && r.status_code < 400).length ?? 0) +
    (ctx?.open_redirects.filter((r) => r.vulnerable).length ?? 0) +
    (ctx?.broken_links.length ?? 0);

  const stats = [
    {
      label: "Subdomains",
      value: ctx?.subdomains.length ?? 0,
      icon: Globe,
      color: "text-text-primary",
    },
    {
      label: "Alive hosts",
      value: ctx?.summary.alive_hosts ?? 0,
      icon: Radio,
      color: "text-severity-success",
    },
    {
      label: "CVEs found",
      value: ctx?.cves.length ?? 0,
      icon: Bug,
      color:
        (ctx?.summary.critical_count ?? 0) > 0
          ? "text-severity-critical"
          : "text-text-primary",
    },
    {
      label: "Secrets",
      value: ctx?.secrets.length ?? 0,
      icon: KeyRound,
      color:
        (ctx?.secrets.length ?? 0) > 0
          ? "text-severity-high"
          : "text-text-primary",
    },
    {
      label: "Vulnerabilities",
      value: vulnCount,
      icon: Bug,
      color: vulnCount > 0 ? "text-severity-critical" : "text-severity-success",
    },
    {
      label: "API endpoints",
      value: ctx?.api_endpoints.length ?? 0,
      icon: Radio,
      color: "text-text-primary",
    },
    {
      label: "Directories",
      value: ctx?.directories.length ?? 0,
      icon: Globe,
      color: "text-text-primary",
    },
    {
      label: "Crawled pages",
      value: ctx?.crawl_results.length ?? 0,
      icon: Radio,
      color: "text-text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="panel p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-text-muted">
              {label}
            </span>
            <Icon className="w-4 h-4 text-text-muted" />
          </div>
          <span className={`text-2xl font-semibold ${color}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}
