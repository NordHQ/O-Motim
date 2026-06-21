import { useScanStore } from "../../store/scanStore";
import StageCard from "./StageCard";
import LiveLog from "./LiveLog";

const STAGES = [
  "Subdomain Discovery",
  "DNS Resolver",
  "HTTP Probe",
  "Fingerprint",
  "Headers Analysis",
  "Secrets Scanner",
  "CVE Match",
  "Backdoor Hunter",
  "CORS Probe",
  "Directory Brute",
  "HTTP Methods",
  "SSL Inspector",
  "Header Dump",
  "Open Redirect",
  "API Discovery",
  "API Brute Force",
  "Form Analysis",
  "Broken Links",
  "Stealth Crawl",
  "Resource Enum",
  "WS Scanner",
  "Host Analyze",
  "Security Probe",
  "Final Report",
];

export default function PipelineView() {
  const stages = useScanStore((s) => s.stages);
  const lastProgress = useScanStore((s) => s.lastProgress);
  const events = useScanStore((s) => s.events);
  const liveLog = useScanStore((s) => s.liveLog);
  const domain = useScanStore((s) => s.domain);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Pipeline{domain ? ` — ${domain}` : ""}
          </h2>
          <p className="text-xs text-text-muted">
            {events.length > 0 ? `${events.length} events processed` : "Idle"}
          </p>
        </div>
        <div className="w-48">
          <div className="h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${Math.round(lastProgress * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-text-muted mt-1 text-right">
            {Math.round(lastProgress * 100)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STAGES.map((name) => (
          <StageCard
            key={name}
            name={name}
            status={stages[name] ?? "pending"}
            lastEvent={events.filter((e) => e.stage === name).slice(-1)[0]}
          />
        ))}
      </div>

      {liveLog.length > 0 && <LiveLog lines={liveLog} />}
    </div>
  );
}
