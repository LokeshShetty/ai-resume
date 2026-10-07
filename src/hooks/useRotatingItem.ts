import { useEffect, useState } from "react";

/**
 * Advances through items on an interval, stopping on the last one.
 * Restarts from the first item whenever the consuming component remounts.
 */
export function useRotatingItem<T>(items: readonly T[], intervalMs = 2500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((current) => Math.min(current + 1, items.length - 1)),
      intervalMs,
    );
    return () => clearInterval(timer);
  }, [items.length, intervalMs]);

  return { index, item: items[index] as T };
}
