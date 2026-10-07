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

/** Every provider adapter implements this single function signature. */
export type LlmAdapter = (request: LlmRequest) => Promise<string>;

export class LlmError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "LlmError";
  }
}
