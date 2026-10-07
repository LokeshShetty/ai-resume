import type { ChatRole } from "@/types";

export interface LlmMessage {
  role: ChatRole;
  content: string;
}

export interface LlmRequest {
  apiKey: string;
  model: string;
  system: string;
  messages: LlmMessage[];
  signal?: AbortSignal;
}

export interface ModelOption {
  id: string;
  label: string;
}

/** Every provider implements this interface; see services/llm/index.ts for the registry. */
export interface LlmProvider {
  generate: (request: LlmRequest) => Promise<string>;
  /** Text-generation models the given key can use, newest/most relevant first. */
  listModels: (apiKey: string, signal?: AbortSignal) => Promise<ModelOption[]>;
}

export class LlmError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LlmError";
  }
}
