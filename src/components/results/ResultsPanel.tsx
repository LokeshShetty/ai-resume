import { FileSearch, KeyRound, RefreshCw } from "lucide-react";
import { Alert, Button, Card, EmptyState } from "@/components/ui";
import { ANALYSIS_STEPS, REVISION_STEPS } from "@/config/constants";
import type { ResumeSession } from "@/hooks/useResumeSession";
import { AnalysisLoader, RotatingStepText } from "./AnalysisLoader";
import { ChatPanel } from "./ChatPanel";
import { MatchInsights } from "./MatchInsights";
import { ResumePreview } from "./ResumePreview";

interface ResultsPanelProps {
  session: ResumeSession;
  isConfigured: boolean;
  onOpenSettings: () => void;
}

/** Short screens (empty, loading, error) stay pinned in view while the inputs column scrolls. */
const PINNED = "space-y-4 lg:sticky lg:top-20";

/** Chooses which screen to show: empty, loading, error, or the tailored result. */
export function ResultsPanel({ session, isConfigured, onOpenSettings }: ResultsPanelProps) {
  const { activeVersion, versions, isLoading, mode, error, chat } = session;

  if (isLoading && mode === "tailor") {
    return (
      <div className={PINNED}>
        <AnalysisLoader steps={ANALYSIS_STEPS} />
      </div>
    );
  }

  if (!activeVersion) {
    return (
      <div className={PINNED}>
        {error && <ErrorAlert message={error} onRetry={session.tailor} />}
        <Card>{isConfigured ? <WelcomeState /> : <NoKeyState onOpenSettings={onOpenSettings} />}</Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorAlert message={error} />}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative">
          <ResumePreview version={activeVersion} versions={versions} onSelectVersion={session.selectVersion} />
          {isLoading && <RevisionOverlay />}
        </div>
        <div className="space-y-4 print:hidden">
          <MatchInsights version={activeVersion} />
          <ChatPanel messages={chat} isLoading={isLoading} onSend={session.revise} onCancel={session.cancel} />
        </div>
      </div>
    </div>
  );
}

function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert
      action={
        onRetry && (
          <Button variant="danger" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
}

function RevisionOverlay() {
  return (
    <div className="absolute inset-0 flex items-start justify-center rounded-xl bg-white/60 pt-32 backdrop-blur-[1px]">
      <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow ring-1 ring-slate-200">
        <RotatingStepText steps={REVISION_STEPS} />
      </div>
    </div>
  );
}

const HOW_IT_WORKS = [
  "Upload or paste the job description",
  "Add your current resume",
  "Optionally add instructions, then click “Tailor my resume”",
  "Preview the result and chat to refine it",
];

function WelcomeState() {
  return (
    <EmptyState
      icon={<FileSearch className="h-6 w-6" />}
      title="Your tailored resume will appear here"
      description={
        <ol className="mt-3 space-y-1.5 text-left">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      }
    />
  );
}

function NoKeyState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <EmptyState
      icon={<KeyRound className="h-6 w-6" />}
      title="Connect an AI provider"
      description="Add your Anthropic, OpenAI, or Gemini API key to start tailoring. Keys stay in your browser."
      action={<Button onClick={onOpenSettings}>Add API key</Button>}
    />
  );
}
