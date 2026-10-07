import type { ModelOption } from "./llm";

/**
 * Puts recommended models (in their recommended order) ahead of the rest.
 * Recommended IDs the key can't access are dropped, so stale suggestions never show up.
 */
export function orderModels(available: ModelOption[], recommended: string[]): ModelOption[] {
  const byId = new Map(available.map((model) => [model.id, model]));
  const preferred = recommended.flatMap((id) => {
    const model = byId.get(id);
    return model ? [model] : [];
  });
  const preferredIds = new Set(preferred.map((model) => model.id));
  return [...preferred, ...available.filter((model) => !preferredIds.has(model.id))];
}

/** Keeps the current model if the key can use it, otherwise picks the best available one. */
export function resolveModel(current: string, options: ModelOption[]): string {
  return options.some((model) => model.id === current) ? current : (options[0]?.id ?? current);
}
