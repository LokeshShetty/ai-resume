import type { TailoredResume } from "@/types";

const extractTag = (text: string, tag: string): string | null => {
  const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)(?:</${tag}>|$)`, "i"));
  return match?.[1]?.trim() ?? null;
};

const parseScore = (value: string | null): number | null => {
  if (!value) return null;
  const score = Number.parseInt(value, 10);
  return Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : null;
};

const parseList = (value: string | null): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

/** Parses the tagged response format defined in prompts.ts. */
export function parseTailoredResume(raw: string): TailoredResume {
  const resume = extractTag(raw, "resume") ?? raw.trim();

  return {
    resume,
    summary: extractTag(raw, "summary") ?? "",
    matchScore: parseScore(extractTag(raw, "match_score")),
    missingKeywords: parseList(extractTag(raw, "missing_keywords")),
  };
}
