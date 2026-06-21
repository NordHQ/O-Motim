import { type PipelineEvent, type StageStatus } from "../../store/scanStore";
import { Check, Loader2, Circle, X, Minus } from "lucide-react";

function statusIcon(status: StageStatus) {
  switch (status) {
    case "done":
      return <Check className="w-4 h-4 text-severity-success" />;
    case "running":
      return <Loader2 className="w-4 h-4 text-accent spin" />;
    case "error":
      return <X className="w-4 h-4 text-severity-critical" />;
    case "skipped":
      return <Minus className="w-4 h-4 text-text-muted" />;
    default:
      return <Circle className="w-4 h-4 text-text-muted" />;
  }
}

const statusLabel: Record<StageStatus, string> = {
  done: "Complete",
  running: "Running",
  error: "Error",
  skipped: "Skipped",
  pending: "Pending",
};

export default function StageCard({
  name,
  status,
  lastEvent,
}: {
  name: string;
  status: StageStatus;
  lastEvent?: PipelineEvent;
}) {
  return (
    <div
      className={`panel p-3 transition-colors ${
        status === "running"
          ? "border-accent/40"
          : status === "done"
            ? "border-severity-success/20"
            : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statusIcon(status)}
          <span className="text-sm font-medium text-text-primary">{name}</span>
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider ${
            status === "running"
              ? "text-accent"
              : status === "done"
                ? "text-severity-success"
                : status === "error"
                  ? "text-severity-critical"
                  : "text-text-muted"
          }`}
        >
          {statusLabel[status]}
        </span>
      </div>
      {(status === "running" || status === "done") && lastEvent && (
        <div className="mt-2 text-[11px] text-text-muted truncate">
          {lastEvent.message}
          {lastEvent.count > 0 && (
            <span className="ml-2 text-text-secondary font-mono">
              {lastEvent.count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
