import { GoogleGenAI } from "@google/genai";
import { MAX_OUTPUT_TOKENS } from "@/config/constants";
import type { LlmAdapter } from "./types";

export const geminiAdapter: LlmAdapter = async ({ apiKey, model, system, messages, signal }) => {
  const client = new GoogleGenAI({ apiKey });

  const response = await client.models.generateContent({
    model,
    contents: messages.map(({ role, content }) => ({
      role: role === "assistant" ? "model" : "user",
      parts: [{ text: content }],
    })),
    config: {
      systemInstruction: system,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: signal,
    },
  });

  return response.text ?? "";
};
