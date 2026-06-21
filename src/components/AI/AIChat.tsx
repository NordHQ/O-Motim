import { useAI, PROVIDERS } from "../../hooks/useAI";
import { Bot, Send, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";

export default function AIChat() {
  const {
    messages, send, clear, ollamaReady,
    provider, model, apiKey, updateSettings,
  } = useAI();
  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);

  const activeProvider = PROVIDERS.find((p) => p.id === provider) ?? PROVIDERS[0];

  const handleSubmit = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {ollamaReady ? (
            <span className="text-severity-success flex items-center gap-1">
              <span className="severity-dot bg-severity-success" />
              {activeProvider.label} ready
            </span>
          ) : (
            <span className="text-text-muted">
              {provider === "ollama" ? "Start Ollama locally" : "Enter API key"}
            </span>
          )}
          <button onClick={clear} className="text-text-muted hover:text-text-secondary">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Provider settings */}
      <div className="panel p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <KeyRound className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-muted">AI provider &amp; credentials (stored locally)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={provider}
            onChange={(e) => {
              const next = PROVIDERS.find((p) => p.id === e.target.value)!;
              updateSettings({ provider: next.id, model: next.models[0] });
            }}
            className="input text-xs py-1.5"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <select
            value={model}
            onChange={(e) => updateSettings({ model: e.target.value })}
            className="input text-xs py-1.5"
          >
            {activeProvider.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        {activeProvider.needsKey && (
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder={`${activeProvider.label} API key…`}
              className="input w-full text-xs py-1.5 pr-16 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted hover:text-text-secondary"
            >
              {showKey ? "hide" : "show"}
            </button>
          </div>
        )}
      </div>

      {/* Context hint */}
      <div className="panel p-3 text-xs text-text-muted">
        Scan context is automatically included with every message. Ask about
        findings, attack paths, or remediation steps.
      </div>

      {/* Chat area */}
      <div className="panel overflow-auto" style={{ height: "calc(100vh - 440px)", minHeight: 240 }}>
        <div className="p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-text-muted py-10 text-sm">
              Start a conversation about your scan results.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surface-raised text-text-secondary"
                }`}
              >
                {msg.pending ? (
                  <span className="text-text-muted pulse-dot">thinking…</span>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={ollamaReady ? "Ask about findings…" : "Configure provider above"}
          disabled={!ollamaReady}
          className="input flex-1"
        />
        <button
          onClick={handleSubmit}
          disabled={!ollamaReady || !input.trim()}
          className="btn-accent px-4"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
