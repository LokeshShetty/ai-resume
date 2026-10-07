export type ProviderId = "anthropic" | "openai" | "gemini";

export interface ProviderSettings {
  apiKey: string;
  model: string;
}

export interface Settings {
  activeProvider: ProviderId;
  providers: Record<ProviderId, ProviderSettings>;
}

/** A document supplied by the user, either uploaded or pasted. */
export interface SourceDocument {
  text: string;
  /** Original file name, or null when the text was pasted. */
  fileName: string | null;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

/** Structured result the AI returns for every tailoring/revision request. */
export interface TailoredResume {
  resume: string;
  summary: string;
  matchScore: number | null;
  missingKeywords: string[];
}

export interface ResumeVersion extends TailoredResume {
  id: string;
  label: string;
  createdAt: number;
}

export type RequestStatus = "idle" | "loading" | "success" | "error";
