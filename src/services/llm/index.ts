import type { ProviderId } from "@/types";
import { LlmError, type LlmAdapter, type LlmRequest } from "./types";

/** Adapters are lazy-loaded so only the selected provider's SDK is downloaded. */
const ADAPTER_LOADERS: Record<ProviderId, () => Promise<LlmAdapter>> = {
  anthropic: () => import("./anthropic").then((m) => m.anthropicAdapter),
  openai: () => import("./openai").then((m) => m.openaiAdapter),
  gemini: () => import("./gemini").then((m) => m.geminiAdapter),
};

/** Single entry point for all LLM calls; normalizes errors across providers. */
export async function complete(provider: ProviderId, request: LlmRequest): Promise<string> {
  try {
    const adapter = await ADAPTER_LOADERS[provider]();
    const text = await adapter(request);
    if (!text.trim()) throw new LlmError("The AI returned an empty response. Please try again.");
    return text;
  } catch (error) {
    if (error instanceof LlmError || request.signal?.aborted) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new LlmError(`Request to ${provider} failed: ${message}`, { cause: error });
  }
}

export { LlmError };
export type { LlmMessage } from "./types";
