import type { GraphNode } from "../../store/scanStore";

interface Props {
  node: GraphNode | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  domain: "🌐 Domain",
  subdomain: "🔗 Subdomain",
  ip: "📍 IP Address",
  tech: "⚙️ Technology",
  cve: "🔴 CVE",
  secret: "🔑 Secret",
  backdoor: "🚪 Backdoor",
  api: "📡 API Endpoint",
  form: "📝 Form",
  url: "📄 URL",
};

export default function NodeDetails({ node, onClose }: Props) {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 w-72 bg-surface border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
          {TYPE_LABELS[node.node_type] ?? node.node_type}
        </span>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-xs"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: node.color }}
        />
        <span className="text-sm font-mono text-text-primary break-all">
          {node.label}
        </span>
      </div>
      {node.detail && (
        <p className="text-xs text-text-secondary mt-2 leading-relaxed">
          {node.detail}
        </p>
      )}
    </div>
  );
}
