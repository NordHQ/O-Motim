import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useScanStore, type StageStatus } from "../../store/scanStore";
import {
  Globe, Search, Radio, Fingerprint, ShieldCheck, KeyRound, Bug, FileText,
  DoorOpen, ArrowRightLeft, FolderTree, Terminal, Lock, FileText as FileDump,
  CornerDownRight, Code2, Database, FileCode, Link2, Eye, Image, Wifi,
  Activity, ShieldAlert, Check, Loader2, Circle, X, Minus, Play,
} from "lucide-react";

interface StageDef {
  name: string;
  short: string;
  icon: typeof Globe;
}

const GROUPS: { label: string; color: string; stages: StageDef[] }[] = [
  {
    label: "Discovery",
    color: "text-[#4488ff]",
    stages: [
      { name: "Subdomain Discovery", short: "Subdomains", icon: Globe },
      { name: "DNS Resolver", short: "DNS", icon: Search },
      { name: "HTTP Probe", short: "HTTP Probe", icon: Radio },
    ],
  },
  {
    label: "Analysis",
    color: "text-[#33bbff]",
    stages: [
      { name: "Fingerprint", short: "Fingerprint", icon: Fingerprint },
      { name: "Headers Analysis", short: "Headers", icon: ShieldCheck },
      { name: "Secrets Scanner", short: "Secrets", icon: KeyRound },
    ],
  },
  {
    label: "Vulnerability",
    color: "text-[#ff4444]",
    stages: [
      { name: "CVE Match", short: "CVEs", icon: Bug },
      { name: "Backdoor Hunter", short: "Backdoors", icon: DoorOpen },
      { name: "CORS Probe", short: "CORS", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Deep Scan",
    color: "text-[#ff7700]",
    stages: [
      { name: "Directory Brute", short: "Dirs", icon: FolderTree },
      { name: "HTTP Methods", short: "Methods", icon: Terminal },
      { name: "SSL Inspector", short: "SSL", icon: Lock },
      { name: "Header Dump", short: "Hdr Dump", icon: FileDump },
      { name: "Open Redirect", short: "Redirects", icon: CornerDownRight },
      { name: "API Discovery", short: "API Disc", icon: Code2 },
      { name: "API Brute Force", short: "API Brute", icon: Database },
      { name: "Form Analysis", short: "Forms", icon: FileCode },
      { name: "Broken Links", short: "Dead Links", icon: Link2 },
    ],
  },
  {
    label: "Recon",
    color: "text-[#aa44ff]",
    stages: [
      { name: "Stealth Crawl", short: "Stealth", icon: Eye },
      { name: "Resource Enum", short: "Resources", icon: Image },
      { name: "WS Scanner", short: "WebSocket", icon: Wifi },
      { name: "Host Analyze", short: "Analyze", icon: Activity },
      { name: "Security Probe", short: "Sec Probe", icon: ShieldAlert },
    ],
  },
  {
    label: "Report",
    color: "text-[#33dd77]",
    stages: [
      { name: "Final Report", short: "Report", icon: FileText },
    ],
  },
];

function statusIcon(status: StageStatus) {
  switch (status) {
    case "done":
      return <Check className="w-3.5 h-3.5 text-severity-success" />;
    case "running":
      return <Loader2 className="w-3.5 h-3.5 text-accent spin" />;
    case "error":
      return <X className="w-3.5 h-3.5 text-severity-critical" />;
    case "skipped":
      return <Minus className="w-3.5 h-3.5 text-text-muted" />;
    case "pending":
    default:
      return <Circle className="w-3.5 h-3.5 text-text-muted" />;
  }
}

export default function Sidebar() {
  const stages = useScanStore((s) => s.stages);
  const domain = useScanStore((s) => s.domain);
  const setView = useScanStore((s) => s.setView);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    "Deep Scan": true,
    Recon: true,
  });
  // Yagona bosqich test oqimi — qaysi bosqich ishga tushayotganini kuzatamiz.
  const [testingStage, setTestingStage] = useState<string | null>(null);

  const toggle = (g: string) =>
    setCollapsed((prev) => ({ ...prev, [g]: !prev[g] }));

  // ▶ tugmasi — faqat shu bosqichni mustaqil ishga tushiradi.
  const runSingle = async (stageName: string) => {
    const target = domain.trim();
    if (!target) {
      alert("Enter a target domain first (top bar) before testing a stage.");
      return;
    }
    setTestingStage(stageName);
    setView("scan");
    try {
      await invoke("run_single_stage", { domain: target, stageName });
    } catch (e) {
      console.error("run_single_stage error:", e);
      alert(`Failed to start stage: ${e}`);
    } finally {
      // Backend darhol qaytadi (spawn), faollashtirish holatini tozlaymiz.
      setTimeout(() => setTestingStage(null), 600);
    }
  };

  return (
    <aside className="w-52 shrink-0 bg-surface border-r border-border flex flex-col">
      <div className="px-3 py-3 text-[11px] uppercase tracking-widest text-text-muted font-medium border-b border-border flex items-center justify-between">
        <span>Pipeline</span>
        <span className="text-[9px] normal-case tracking-normal text-text-muted/70">
          ▶ test
        </span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {GROUPS.map((group) => {
          const doneCount = group.stages.filter(
            (s) => stages[s.name] === "done"
          ).length;
          const runningCount = group.stages.filter(
            (s) => stages[s.name] === "running"
          ).length;
          const isCollapsed = collapsed[group.label] ?? false;

          return (
            <div key={group.label} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggle(group.label)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-surface-raised/50 transition-colors`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${group.color}`}
                >
                  {group.label}
                </span>
                <span className="flex-1" />
                {runningCount > 0 && (
                  <span className="text-[9px] bg-accent text-black rounded px-1 font-bold">
                    {runningCount}
                  </span>
                )}
                <span className="text-[9px] text-text-muted">
                  {doneCount}/{group.stages.length}
                </span>
                <span className="text-[9px] text-text-muted">
                  {isCollapsed ? "▸" : "▾"}
                </span>
              </button>

              {/* Stages */}
              {!isCollapsed && (
                <ul className="space-y-0.5 px-2">
                  {group.stages.map(({ name, short, icon: Icon }) => {
                    const status = stages[name] ?? "pending";
                    const isRunning = status === "running" || testingStage === name;
                    return (
                      <li
                        key={name}
                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded text-xs group ${
                          isRunning ? "bg-accent/5 border-l-2 border-accent" : ""
                        }`}
                      >
                        {statusIcon(isRunning && status === "pending" ? "running" : status)}
                        <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors" />
                        <span
                          className={
                            isRunning
                              ? "text-text-primary font-medium flex-1"
                              : status === "done"
                                ? "text-text-secondary flex-1"
                                : "text-text-muted flex-1"
                          }
                        >
                          {short}
                        </span>
                        {/* ▶ bosqichni mustaqil test qilish */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            runSingle(name);
                          }}
                          disabled={isRunning}
                          title={`Test only: ${name}`}
                          className={`p-0.5 rounded transition-colors ${
                            isRunning
                              ? "text-text-muted/40 cursor-not-allowed"
                              : "text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent"
                          }`}
                        >
                          {isRunning ? (
                            <Loader2 className="w-3 h-3 spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
