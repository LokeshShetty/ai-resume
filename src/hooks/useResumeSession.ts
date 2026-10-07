import { useCallback, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import type { LlmMessage } from "@/services/llm";
import { buildRevisionMessage, buildTailorMessage } from "@/services/prompts";
import { requestResume } from "@/services/resumeService";
import type { ChatMessage, RequestStatus, ResumeVersion, SourceDocument } from "@/types";
import { createId } from "@/utils/id";

export type SessionMode = "tailor" | "revise";

const EMPTY_DOCUMENT: SourceDocument = { text: "", fileName: null };

const createChatMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  id: createId(),
  role,
  content,
  createdAt: Date.now(),
});

/** Owns all state for one tailoring session: inputs, AI conversation, and resume versions. */
export function useResumeSession() {
  const { settings, activeCredentials } = useSettings();

  const [jobDescription, setJobDescription] = useState(EMPTY_DOCUMENT);
  const [resume, setResume] = useState(EMPTY_DOCUMENT);
  const [instructions, setInstructions] = useState("");

  const [conversation, setConversation] = useState<LlmMessage[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);

  const [status, setStatus] = useState<RequestStatus>("idle");
  const [mode, setMode] = useState<SessionMode>("tailor");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeVersion = versions.find((version) => version.id === activeVersionId) ?? null;
  const isLoading = status === "loading";
  const canTailor = Boolean(jobDescription.text.trim() && resume.text.trim()) && !isLoading;

  /** Shared request lifecycle for both the initial tailoring and later revisions. */
  const run = useCallback(
    async (nextMode: SessionMode, history: LlmMessage[], userMessage: LlmMessage) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setMode(nextMode);
      setStatus("loading");
      setError(null);

      try {
        const messages = [...history, userMessage];
        const { raw, result } = await requestResume({
          provider: settings.activeProvider,
          credentials: activeCredentials,
          messages,
          signal: controller.signal,
        });

        const version: ResumeVersion = {
          ...result,
          id: createId(),
          label: nextMode === "tailor" ? "Tailored" : "Revision",
          createdAt: Date.now(),
        };

        setConversation([...messages, { role: "assistant", content: raw }]);
        setVersions((current) => [...current, version]);
        setActiveVersionId(version.id);
        setChat((current) => [
          ...current,
          createChatMessage("assistant", result.summary || "Your resume has been updated."),
        ]);
        setStatus("success");
      } catch (err) {
        if (controller.signal.aborted) {
          setStatus(versions.length ? "success" : "idle");
          return;
        }
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [settings.activeProvider, activeCredentials, versions.length],
  );

  const tailor = useCallback(() => {
    if (!canTailor) return;
    setChat(instructions.trim() ? [createChatMessage("user", instructions.trim())] : []);
    return run(
      "tailor",
      [],
      buildTailorMessage({ jobDescription: jobDescription.text, resume: resume.text, instructions }),
    );
  }, [canTailor, instructions, jobDescription.text, resume.text, run]);

  const revise = useCallback(
    (feedback: string) => {
      const trimmed = feedback.trim();
      if (!trimmed || !activeVersion || isLoading) return;
      setChat((current) => [...current, createChatMessage("user", trimmed)]);
      return run(
        "revise",
        conversation,
        buildRevisionMessage({ feedback: trimmed, currentResume: activeVersion.resume }),
      );
    },
    [activeVersion, conversation, isLoading, run],
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setConversation([]);
    setChat([]);
    setVersions([]);
    setActiveVersionId(null);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    inputs: {
      jobDescription,
      setJobDescription,
      resume,
      setResume,
      instructions,
      setInstructions,
    },
    chat,
    versions,
    activeVersion,
    selectVersion: setActiveVersionId,
    status,
    mode,
    error,
    isLoading,
    canTailor,
    tailor,
    revise,
    cancel,
    reset,
  };
}

export type ResumeSession = ReturnType<typeof useResumeSession>;
