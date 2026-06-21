import { useCallback, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useScanStore } from "../store/scanStore";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

/// Qo'llab-quvvatlanadigan AI provayderlar.
export interface ProviderOption {
  id: string;
  label: string;
  models: string[];
  needsKey: boolean;
}

export const PROVIDERS: ProviderOption[] = [
  { id: "anthropic", label: "Claude (Anthropic)", needsKey: true,
    models: ["claude-3-5-haiku-latest", "claude-3-5-sonnet-latest", "claude-3-opus-latest"] },
  { id: "gemini", label: "Gemini (Google)", needsKey: true,
    models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"] },
  { id: "openai", label: "OpenAI", needsKey: true,
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"] },
  { id: "groq", label: "Groq", needsKey: true,
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"] },
  { id: "deepseek", label: "DeepSeek", needsKey: true,
    models: ["deepseek-chat", "deepseek-reasoner"] },
  { id: "mistral", label: "Mistral", needsKey: true,
    models: ["mistral-small-latest", "mistral-large-latest", "open-mixtral-8x7b"] },
  { id: "ollama", label: "Ollama (local)", needsKey: false,
    models: ["llama3.2", "qwen2.5", "mistral", "phi3"] },
];

const LS_KEY = "omotim.ai.settings.v1";

interface AiSettings {
  provider: string;
  model: string;
  apiKey: string;
}

function loadSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AiSettings>;
      return {
        provider: parsed.provider ?? "anthropic",
        model: parsed.model ?? "claude-3-5-haiku-latest",
        apiKey: parsed.apiKey ?? "",
      };
    }
  } catch {
    // ignore
  }
  return { provider: "anthropic", model: "claude-3-5-haiku-latest", apiKey: "" };
}

function saveSettings(s: AiSettings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function useAI() {
  const context = useScanStore((s) => s.context);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<AiSettings>(loadSettings);

  const updateSettings = useCallback((patch: Partial<AiSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // "ready" — lokal ollama provayderi yoki kalit kiritilgan bulutli provayder.
  const ready = settings.provider === "ollama" || settings.apiKey.trim().length > 0;

  const send = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userMsg: ChatMessage = { role: "user", content: text };
      const pending: ChatMessage = { role: "assistant", content: "", pending: true };
      setMessages((m) => [...m, userMsg, pending]);
      try {
        const reply = await invoke<string>("ai_chat", {
          message: text,
          context,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey || null,
        });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "assistant", content: reply };
          return next;
        });
      } catch (e) {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            content: `⚠️ ${String(e)}`,
          };
          return next;
        });
      }
    },
    [context, settings.provider, settings.model, settings.apiKey]
  );

  const clear = useCallback(() => setMessages([]), []);

  // Backwards-compat nom bilan — eski UI ready/refresh prop'larini chaqiradi.
  return {
    messages,
    send,
    clear,
    ollamaReady: ready,
    refresh: () => undefined,
    context,
    provider: settings.provider,
    model: settings.model,
    apiKey: settings.apiKey,
    updateSettings,
  };
}
