import Anthropic from "@anthropic-ai/sdk";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import { LlmError, type LlmAdapter } from "./types";

/** Models that accept `output_config.effort` and server-side refusal fallbacks. */
const ADVANCED_MODEL_PREFIXES = ["claude-opus-5", "claude-sonnet-5-5", "claude-fable-5"];

const isAdvancedModel = (model: string) =>
  ADVANCED_MODEL_PREFIXES.some((prefix) => model.startsWith(prefix));

export const anthropicAdapter: LlmAdapter = async ({ apiKey, model, system, messages, signal }) => {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const advanced = isAdvancedModel(model);

  const stream = client.beta.messages.stream(
    {
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system,
      messages,
      ...(advanced && {
        output_config: { effort: "high" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      }),
    },
    { signal },
  );
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") {
    throw new LlmError("The model declined to process this request. Try rephrasing your input.");
  }

  return message.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("");
};
