import { GoogleGenAI } from "@google/genai";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import type { LlmProvider } from "./types";

const NON_TEXT_MODEL = /(embedding|image|tts|audio|live|robotics|computer-use)/i;

const createClient = (apiKey: string) => new GoogleGenAI({ apiKey });

export const geminiProvider: LlmProvider = {
  async generate({ apiKey, model, system, messages, signal }) {
    const response = await createClient(apiKey).models.generateContent({
      model,
      contents: messages.map(({ role, content }) => ({
        role: role === "assistant" ? "model" : "user",
        parts: [{ text: content }],
      })),
      config: { systemInstruction: system, maxOutputTokens: MAX_OUTPUT_TOKENS, abortSignal: signal },
    });
    return response.text ?? "";
  },

  async listModels(apiKey, signal) {
    const models = [];
    const pager = await createClient(apiKey).models.list({ config: { pageSize: 100, abortSignal: signal } });
    for await (const model of pager) {
      const id = model.name?.replace(/^models\//, "") ?? "";
      if (id.startsWith("gemini") && model.supportedActions?.includes("generateContent") && !NON_TEXT_MODEL.test(id)) {
        models.push({ id, label: model.displayName ?? id });
      }
    }
    // Highest version first (e.g. gemini-3.8 before gemini-2.5).
    return models.sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }));
  },
};
