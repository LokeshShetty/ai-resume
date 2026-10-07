export const STORAGE_KEYS = {
  settings: "ai-resume:settings",
} as const;

export const ACCEPTED_FILE_TYPES = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".md": "text/markdown",
} as const;

export const ACCEPT_ATTRIBUTE = Object.keys(ACCEPTED_FILE_TYPES).join(",");

export const MAX_FILE_SIZE_MB = 10;

export const MAX_OUTPUT_TOKENS = 16000;

/** Messages cycled through while the AI is working, so the wait feels alive. */
export const ANALYSIS_STEPS = [
  "Reading the job description",
  "Extracting key skills and requirements",
  "Reviewing your resume",
  "Matching experience to requirements",
  "Rewriting bullet points",
  "Polishing the final draft",
] as const;

export const REVISION_STEPS = [
  "Reading your feedback",
  "Applying changes",
  "Polishing the final draft",
] as const;

export const QUICK_PROMPTS = [
  "Keep it to one page",
  "Emphasize leadership experience",
  "Use a more concise tone",
  "Quantify achievements where possible",
] as const;
