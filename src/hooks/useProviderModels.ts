import { useEffect, useRef, useState } from "react";
import { PROVIDERS } from "@/config/providers";
import { listModels, type ModelOption } from "@/services/llm";
import { orderModels } from "@/services/modelOptions";
import type { ProviderId } from "@/types";

const MIN_KEY_LENGTH = 10;
const DEBOUNCE_MS = 600;

type Result =
  | { status: "success"; models: ModelOption[] }
  | { status: "error"; error: string };

interface Entry {
  requestKey: string;
  result: Result;
}

export type ModelsState =
  | { status: "idle" | "loading"; models: ModelOption[] }
  | { status: "success"; models: ModelOption[] }
  | { status: "error"; models: ModelOption[]; error: string };

const fallbackModels = (providerId: ProviderId): ModelOption[] =>
  PROVIDERS[providerId].models.map((id) => ({ id, label: id }));

/**
 * Loads the models the API key can actually use, so the model picker never offers retired models.
 * Falls back to the built-in suggestions until the key is entered or if the request fails.
 */
export function useProviderModels(
  providerId: ProviderId,
  apiKey: string,
  onLoaded?: (models: ModelOption[]) => void,
): ModelsState {
  const key = apiKey.trim();
  const requestKey = `${providerId}:${key}`;
  const [entry, setEntry] = useState<Entry | null>(null);
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  });

  useEffect(() => {
    if (key.length < MIN_KEY_LENGTH) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const models = orderModels(await listModels(providerId, key, controller.signal), PROVIDERS[providerId].models);
        if (!models.length) throw new Error("No text models are available for this key.");
        setEntry({ requestKey, result: { status: "success", models } });
        onLoadedRef.current?.(models);
      } catch (error) {
        if (controller.signal.aborted) return;
        setEntry({ requestKey, result: { status: "error", error: error instanceof Error ? error.message : String(error) } });
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [providerId, key, requestKey]);

  const fallback = fallbackModels(providerId);
  if (key.length < MIN_KEY_LENGTH) return { status: "idle", models: fallback };
  if (entry?.requestKey !== requestKey) return { status: "loading", models: fallback };
  return entry.result.status === "success"
    ? entry.result
    : { status: "error", models: fallback, error: entry.result.error };
}
