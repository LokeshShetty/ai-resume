import { useState } from "react";
import { extractText } from "@/services/fileParser";

/** Wraps file text extraction with loading and error state. */
export function useFileText(onExtracted: (text: string, fileName: string) => void) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = async (file: File) => {
    setIsParsing(true);
    setError(null);
    try {
      onExtracted(await extractText(file), file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this file.");
    } finally {
      setIsParsing(false);
    }
  };

  return { parse, isParsing, error, clearError: () => setError(null) };
}
