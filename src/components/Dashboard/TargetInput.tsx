import { useState, useEffect } from "react";
import { useScan } from "../../hooks/useScan";
import { useScanStore } from "../../store/scanStore";
import { Play, Square } from "lucide-react";

const SAMPLE_TARGETS = ["example.com", "hackerone.com", "bugcrowd.com"];

export default function TargetInput() {
  const { start, stop, scanning } = useScan();
  const stored = useScanStore((s) => s.domain);
  const [value, setValue] = useState(stored);

  useEffect(() => {
    setValue(stored);
  }, [stored]);

  const submit = () => {
    if (scanning) {
      stop();
    } else {
      start(value);
    }
  };

  return (
    <div className="panel p-5">
      <label className="text-[11px] uppercase tracking-wider text-text-muted">
        Target domain
      </label>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. target.com"
          disabled={scanning}
          className="input flex-1 font-mono"
          autoFocus
        />
        <button
          onClick={submit}
          className={scanning ? "btn-ghost" : "btn-accent"}
        >
          {scanning ? (
            <>
              <Square className="w-3.5 h-3.5 inline mr-1" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 inline mr-1" />
              Start scan
            </>
          )}
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-text-muted">
        <span>Try:</span>
        {SAMPLE_TARGETS.map((t) => (
          <button
            key={t}
            onClick={() => !scanning && setValue(t)}
            className="text-text-secondary hover:text-accent transition-colors underline-offset-2 hover:underline"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
