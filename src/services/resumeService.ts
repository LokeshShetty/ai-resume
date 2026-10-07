import type { ProviderSettings, ProviderId, TailoredResume } from "@/types";
import { complete, type LlmMessage } from "./llm";
import { SYSTEM_PROMPT } from "./prompts";
import { parseTailoredResume } from "./responseParser";

export interface ResumeRequest {
  provider: ProviderId;
  credentials: ProviderSettings;
  /** Full conversation so far, ending with the new user message. */
  messages: LlmMessage[];
  signal?: AbortSignal;
}

export interface ResumeResponse {
  raw: string;
  result: TailoredResume;
}

/** Sends the conversation to the selected provider and parses the tailored resume. */
export async function requestResume({
  provider,
  credentials,
  messages,
  signal,
}: ResumeRequest): Promise<ResumeResponse> {
  const raw = await complete(provider, {
    apiKey: credentials.apiKey,
    model: credentials.model,
    system: SYSTEM_PROMPT,
    messages,
    signal,
  });
  return { raw, result: parseTailoredResume(raw) };
}
