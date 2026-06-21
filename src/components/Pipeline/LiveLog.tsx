import { useEffect, useRef } from "react";

export default function LiveLog({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="panel">
      <div className="px-3 py-2 border-b border-border text-[11px] uppercase tracking-wider text-text-muted">
        Live log
      </div>
      <pre
        ref={ref}
        className="p-3 text-[11px] font-mono text-text-secondary max-h-60 overflow-auto leading-relaxed"
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}
