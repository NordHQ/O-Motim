import { useState } from "react";
import { useAI, PROVIDERS } from "../../hooks/useAI";
import { Bot, Send, Trash2, ChevronRight, ChevronLeft, KeyRound } from "lucide-react";

export default function AIAssistant() {
  const [open, setOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const {
    messages, send, clear, ollamaReady,
    provider, model, apiKey, updateSettings,
  } = useAI();
  const [input, setInput] = useState("");

  const activeProvider = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-16 bg-surface border-l border-border flex items-center justify-center hover:bg-surface-raised transition-colors"
        title="Open AI panel"
      >
        <ChevronLeft className="w-3.5 h-3.5 text-text-muted" />
      </button>
    );
  }

  const handleSubmit = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div className="w-72 shrink-0 bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-text-primary">{activeProvider.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`p-1 transition-colors ${showSettings ? "text-accent" : "text-text-muted hover:text-text-secondary"}`}
            title="Provider settings"
          >
            <KeyRound className="w-3 h-3" />
          </button>
          <button
            onClick={clear}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Provider settings */}
      {showSettings && (
        <div className="px-3 py-2 border-b border-border space-y-1.5 bg-background/40">
          <select
            value={provider}
            onChange={(e) => {
              const next = PROVIDERS.find((p) => p.id === e.target.value)!;
              updateSettings({ provider: next.id, model: next.models[0] });
            }}
            className="input w-full text-[11px] py-1"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <select
            value={model}
            onChange={(e) => updateSettings({ model: e.target.value })}
            className="input w-full text-[11px] py-1"
          >
            {activeProvider.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {activeProvider.needsKey && (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder={`${activeProvider.label} API key…`}
              className="input w-full text-[11px] py-1 font-mono"
            />
          )}
        </div>
      )}

      {/* Status */}
      <div className="px-3 py-1.5 text-[10px] border-b border-border">
        {ollamaReady ? (
          <span className="text-severity-success">● {activeProvider.label} ready</span>
        ) : (
          <span className="text-text-muted">
            {provider === "ollama"
              ? "○ Ollama not detected — start it locally"
              : "○ Enter API key in settings"}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-3 py-2 space-y-2 min-h-0">
        {messages.length === 0 && (
          <div className="text-[11px] text-text-muted text-center py-4">
            Ask about findings, attack vectors, or remediation steps.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[12px] leading-relaxed ${
              msg.role === "user"
                ? "text-text-primary bg-surface-raised rounded px-2.5 py-1.5"
                : "text-text-secondary"
            }`}
          >
            {msg.pending ? (
              <span className="text-text-muted pulse-dot">thinking…</span>
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={ollamaReady ? "Ask AI…" : "Configure provider…"}
            disabled={!ollamaReady}
            className="input flex-1 text-xs py-1.5"
          />
          <button
            onClick={handleSubmit}
            disabled={!ollamaReady || !input.trim()}
            className="btn-accent px-2 py-1.5 text-xs"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
