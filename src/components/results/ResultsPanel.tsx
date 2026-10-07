import { FileSearch, KeyRound } from "lucide-react";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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
        <Card className="py-0">{isConfigured ? <WelcomeState /> : <NoKeyState onOpenSettings={onOpenSettings} />}</Card>
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

function RevisionOverlay() {
  return (
    <div className="absolute inset-0 flex items-start justify-center rounded-xl bg-background/60 pt-32 backdrop-blur-[1px]">
      <div className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow">
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
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
          <FileSearch />
        </EmptyMedia>
        <EmptyTitle className="text-base">Your tailored resume will appear here</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <ol className="space-y-1.5 text-left text-muted-foreground">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </EmptyContent>
    </Empty>
  );
}

function NoKeyState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10 text-primary">
          <KeyRound />
        </EmptyMedia>
        <EmptyTitle className="text-base">Connect an AI provider</EmptyTitle>
        <EmptyDescription>
          Add your Anthropic, OpenAI, or Gemini API key to start tailoring. Keys stay in your browser.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onOpenSettings}>Add API key</Button>
      </EmptyContent>
    </Empty>
  );
}
