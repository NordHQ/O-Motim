import { useScanStore, type View } from "../../store/scanStore";
import logo from "../../assets/logo.jpg";

const NAV: { id: View; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "scan", label: "Scan" },
  { id: "results", label: "Results" },
  { id: "graph", label: "Graph" },
  { id: "ai", label: "AI" },
  { id: "report", label: "Report" },
];

export default function Topbar() {
  const view = useScanStore((s) => s.view);
  const setView = useScanStore((s) => s.setView);
  const scanning = useScanStore((s) => s.scanning);

  return (
    <header className="flex items-center h-12 px-4 bg-surface border-b border-border shrink-0">
      <div className="flex items-center gap-2 font-semibold text-text-primary mr-6">
        <img src={logo} alt="MOTIM" className="w-6 h-6 rounded" />
        <span className="tracking-wide">O'MOTIM</span>
        {scanning && (
          <span className="ml-2 flex items-center gap-1 text-[11px] text-severity-success">
            <span className="severity-dot bg-severity-success pulse-dot" />
            SCANNING
          </span>
        )}
      </div>
      <nav className="flex items-center gap-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              view === item.id
                ? "bg-surface-raised text-text-primary border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
