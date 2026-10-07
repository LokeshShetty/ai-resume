import OpenAI from "openai";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import type { LlmAdapter } from "./types";

export const openaiAdapter: LlmAdapter = async ({ apiKey, model, system, messages, signal }) => {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.responses.create(
    {
      model,
      instructions: system,
      input: messages,
      max_output_tokens: MAX_OUTPUT_TOKENS,
    },
    { signal },
  );

  return response.output_text;
};
