import { useState } from "react";

/** Copies text to the clipboard and exposes a short-lived "copied" flag. */
export function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), resetMs);
  };

  return { copied, copy };
}
