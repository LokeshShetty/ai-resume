import Anthropic from "@anthropic-ai/sdk";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import { LlmError, type LlmProvider, type LlmRequest } from "./types";

/** Models documented to accept server-side refusal fallbacks. */
const FALLBACK_MODEL_PREFIXES = ["claude-opus-5", "claude-sonnet-5-5", "claude-fable-5"];

const createClient = (apiKey: string) => new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

/** Effort support comes from the Models API, so new models work without code changes. */
const effortSupportCache = new Map<string, boolean>();

async function supportsHighEffort(client: Anthropic, model: string): Promise<boolean> {
  const cached = effortSupportCache.get(model);
  if (cached !== undefined) return cached;
  try {
    const info = await client.models.retrieve(model);
    const supported = Boolean(info.capabilities?.effort.supported && info.capabilities.effort.high.supported);
    effortSupportCache.set(model, supported);
    return supported;
  } catch {
    return false;
  }
}

async function streamText(client: Anthropic, request: LlmRequest, options: { effort: boolean; fallback: boolean }) {
  const { model, system, messages, signal } = request;
  const stream = client.beta.messages.stream(
    {
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system,
      messages,
      ...(options.effort && { output_config: { effort: "high" } }),
      ...(options.fallback && { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }),
    },
    { signal },
  );
  return stream.finalMessage();
}

export const anthropicProvider: LlmProvider = {
  async generate(request) {
    const client = createClient(request.apiKey);
    const effort = await supportsHighEffort(client, request.model);
    const fallback = FALLBACK_MODEL_PREFIXES.some((prefix) => request.model.startsWith(prefix));

    let message;
    try {
      message = await streamText(client, request, { effort, fallback });
    } catch (error) {
      // If a model rejects the fallback option, retry once without it rather than failing.
      if (!(fallback && error instanceof Anthropic.BadRequestError && /fallback/i.test(error.message))) throw error;
      message = await streamText(client, request, { effort, fallback: false });
    }

    if (message.stop_reason === "refusal") {
      throw new LlmError("The model declined to process this request. Try rephrasing your input.");
    }
    return message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
  },

  async listModels(apiKey, signal) {
    const models = [];
    for await (const model of createClient(apiKey).models.list({ limit: 100 }, { signal })) {
      models.push({ id: model.id, label: model.display_name });
    }
    return models; // The API already returns newest first.
  },
};
