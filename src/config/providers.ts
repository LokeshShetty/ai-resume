import type { ProviderId, Settings } from "@/types";

export interface ProviderDefinition {
  id: ProviderId;
  label: string;
  /** Suggested models; the first is the default. Users can still enter any model ID. */
  models: string[];
  keyPlaceholder: string;
  keyUrl: string;
}

export const PROVIDERS: Record<ProviderId, ProviderDefinition> = {
  anthropic: {
    id: "anthropic",
    label: "Anthropic Claude",
    models: ["claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-4-5"],
    keyPlaceholder: "sk-ant-...",
    keyUrl: "https://platform.claude.com/settings/keys",
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    models: ["gpt-6.1-sol", "gpt-6-astra", "gpt-6-luna"],
    keyPlaceholder: "sk-...",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    models: ["gemini-3.8-flash", "gemini-3.1-pro-preview", "gemini-3.5-flash-lite"],
    keyPlaceholder: "AIza...",
    keyUrl: "https://aistudio.google.com/apikey",
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

const defaultProviderSettings = (id: ProviderId) => ({
  apiKey: "",
  model: PROVIDERS[id].models[0] ?? "",
});

export const DEFAULT_SETTINGS: Settings = {
  activeProvider: "anthropic",
  providers: {
    anthropic: defaultProviderSettings("anthropic"),
    openai: defaultProviderSettings("openai"),
    gemini: defaultProviderSettings("gemini"),
  },
};
