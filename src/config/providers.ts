import type { ProviderId, Settings } from "@/types";

export interface ProviderDefinition {
  id: ProviderId;
  label: string;
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
    models: ["gpt-5", "gpt-5-mini", "gpt-4.1"],
    keyPlaceholder: "sk-...",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    models: ["gemini-2.5-pro", "gemini-2.5-flash"],
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
