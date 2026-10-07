import { FileSearch, KeyRound } from "lucide-react";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ANALYSIS_STEPS, REVISION_STEPS } from "@/config/constants";
import type { ResumeSession } from "@/hooks/useResumeSession";
import { SCROLL_PANE } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { AnalysisLoader, RotatingStepText } from "./AnalysisLoader";
import { ChatPanel } from "./ChatPanel";
import { MatchInsights } from "./MatchInsights";
import { ResumePreview } from "./ResumePreview";

interface ResultsPanelProps {
  session: ResumeSession;
  isConfigured: boolean;
  onOpenSettings: () => void;
}

const STATE_SCREEN = cn("space-y-4", SCROLL_PANE);

/** Chooses which screen to show: empty, loading, error, or the tailored result. */
export function ResultsPanel({ session, isConfigured, onOpenSettings }: ResultsPanelProps) {
  const { activeVersion, versions, isLoading, mode, error, chat } = session;

  if (isLoading && mode === "tailor") {
    return (
      <div className={STATE_SCREEN}>
        <AnalysisLoader steps={ANALYSIS_STEPS} />
      </div>
    );
  }

  if (!activeVersion) {
    return (
      <div className={STATE_SCREEN}>
        {error && <ErrorAlert message={error} onRetry={session.tailor} />}
        <Card className="py-0">{isConfigured ? <WelcomeState /> : <NoKeyState onOpenSettings={onOpenSettings} />}</Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      {error && <ErrorAlert message={error} />}
      {/* lg: preview and side panels stack and scroll together; xl: two columns that scroll independently. */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4 lg:flex-1",
          SCROLL_PANE,
          "xl:grid-cols-[minmax(0,1fr)_360px] xl:grid-rows-[minmax(0,1fr)] xl:overflow-visible",
        )}
      >
        <div className="relative xl:min-h-0">
          <ResumePreview
            className="xl:h-full"
            version={activeVersion}
            versions={versions}
            onSelectVersion={session.selectVersion}
          />
          {isLoading && <RevisionOverlay />}
        </div>
        <div className={cn("flex flex-col gap-4", "xl:-m-1 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:p-1")}>
          <MatchInsights version={activeVersion} />
          <ChatPanel
            className="xl:min-h-[360px] xl:flex-1"
            messages={chat}
            isLoading={isLoading}
            onSend={session.revise}
            onCancel={session.cancel}
          />
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
