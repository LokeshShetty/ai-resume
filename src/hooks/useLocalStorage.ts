import { useCallback, useState } from "react";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? { ...fallback, ...(JSON.parse(stored) as T) } : fallback;
  } catch {
    return fallback;
  }
};

/** useState that persists to localStorage. Storage failures are ignored (e.g. private mode). */
export function useLocalStorage<T extends object>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback));

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* persistence is best-effort */
      }
    },
    [key],
  );

  return [value, update] as const;
}
