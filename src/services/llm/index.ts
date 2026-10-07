import type { ProviderId } from "@/types";
import { LlmError, type LlmProvider, type LlmRequest, type ModelOption } from "./types";

/** Providers are lazy-loaded so only the selected SDK is downloaded. */
const PROVIDER_LOADERS: Record<ProviderId, () => Promise<LlmProvider>> = {
  anthropic: () => import("./anthropic").then((m) => m.anthropicProvider),
  openai: () => import("./openai").then((m) => m.openaiProvider),
  gemini: () => import("./gemini").then((m) => m.geminiProvider),
};

const MODEL_UNAVAILABLE = /model.*(not found|not exist|no longer available|not supported)|NOT_FOUND|404/i;

/** Adds an actionable hint for errors users can fix themselves. */
const withHint = (message: string) =>
  MODEL_UNAVAILABLE.test(message)
    ? `${message}\n\nThis model may be retired or unavailable for your key. Choose another model in Settings.`
    : message;

/** Runs a provider call and normalizes every failure into an LlmError (aborts pass through). */
async function callProvider<T>(
  providerId: ProviderId,
  signal: AbortSignal | undefined,
  call: (provider: LlmProvider) => Promise<T>,
): Promise<T> {
  try {
    return await call(await PROVIDER_LOADERS[providerId]());
  } catch (error) {
    if (error instanceof LlmError || signal?.aborted) throw error;
    const message = error instanceof Error ? error.message : String(error);
    throw new LlmError(withHint(`Request to ${providerId} failed: ${message}`), { cause: error });
  }
}

export async function complete(providerId: ProviderId, request: LlmRequest): Promise<string> {
  const text = await callProvider(providerId, request.signal, (provider) => provider.generate(request));
  if (!text.trim()) throw new LlmError("The AI returned an empty response. Please try again.");
  return text;
}

export function listModels(providerId: ProviderId, apiKey: string, signal?: AbortSignal): Promise<ModelOption[]> {
  return callProvider(providerId, signal, (provider) => provider.listModels(apiKey, signal));
}

export { LlmError };
export type { LlmMessage, ModelOption } from "./types";
