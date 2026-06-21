import { useScanStore } from "../../store/scanStore";
import { Cpu, MemoryStick, Activity, Clock } from "lucide-react";

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function StatusBar() {
  const stats = useScanStore((s) => s.stats);
  const elapsed = useScanStore((s) => s.elapsedSecs);
  const scanning = useScanStore((s) => s.scanning);
  const domain = useScanStore((s) => s.domain);

  const cpu = stats?.cpu_usage ?? 0;
  const ram = stats?.ram_used_mb ?? 0;
  const threads = stats?.thread_count ?? 0;
  const cpuColor =
    cpu > 80 ? "text-severity-critical" : cpu > 60 ? "text-severity-medium" : "text-text-secondary";

  return (
    <footer className="flex items-center h-7 px-4 bg-surface border-t border-border text-[11px] text-text-muted font-mono gap-5 shrink-0">
      <div className="flex items-center gap-1.5">
        <Cpu className={`w-3 h-3 ${cpuColor}`} />
        <span className={cpuColor}>CPU {cpu.toFixed(0)}%</span>
      </div>
      <div className="flex items-center gap-1.5">
        <MemoryStick className="w-3 h-3" />
        <span>RAM {ram} MB</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Activity className="w-3 h-3" />
        <span>Threads {threads}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>Elapsed {fmtTime(elapsed)}</span>
      </div>

      <div className="flex-1" />

      {domain && (
        <span className="text-text-secondary">
          target: <span className="text-text-primary">{domain}</span>
        </span>
      )}
      {scanning && (
        <span className="flex items-center gap-1.5 text-severity-success">
          <span className="severity-dot bg-severity-success pulse-dot" />
          pipeline active
        </span>
      )}
    </footer>
  );
}
