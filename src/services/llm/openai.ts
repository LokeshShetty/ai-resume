import OpenAI from "openai";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import type { LlmProvider } from "./types";

/** The Models API lists every model type; keep only general text-generation models. */
const TEXT_MODEL = /^(gpt|o\d|chatgpt)/i;
const NON_TEXT_MODEL = /(image|audio|realtime|tts|transcribe|embedding|moderation|search|instruct|cyber|rosalind)/i;

const createClient = (apiKey: string) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const isRetired = (shutdownDate?: string | null) => Boolean(shutdownDate && new Date(shutdownDate) <= new Date());

export const openaiProvider: LlmProvider = {
  async generate({ apiKey, model, system, messages, signal }) {
    const response = await createClient(apiKey).responses.create(
      { model, instructions: system, input: messages, max_output_tokens: MAX_OUTPUT_TOKENS },
      { signal },
    );
    return response.output_text;
  },

  async listModels(apiKey, signal) {
    const models = [];
    for await (const model of createClient(apiKey).models.list({ signal })) {
      if (TEXT_MODEL.test(model.id) && !NON_TEXT_MODEL.test(model.id) && !isRetired(model.shutdown_date)) {
        models.push(model);
      }
    }
    return models.sort((a, b) => b.created - a.created).map(({ id }) => ({ id, label: id }));
  },
};
