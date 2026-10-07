import { Check } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useRotatingItem } from "@/hooks/useRotatingItem";
import { cn } from "@/lib/utils";

interface AnalysisLoaderProps {
  steps: readonly string[];
}

/** Full loading screen: step-by-step progress beside a skeleton of the resume. */
export function AnalysisLoader({ steps }: AnalysisLoaderProps) {
  const { index } = useRotatingItem(steps);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true" aria-live="polite">
      <SectionCard title="Generating your resume" description="This usually takes 20–60 seconds">
        <ResumeSkeleton />
      </SectionCard>
      <SectionCard title="AI is analyzing" icon={<Spinner />}>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <StepItem key={step} label={step} state={i < index ? "done" : i === index ? "active" : "pending"} />
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}

type StepState = "done" | "active" | "pending";

function StepItem({ label, state }: { label: string; state: StepState }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          state === "done" && "bg-emerald-100 text-emerald-600",
          state === "active" && "bg-primary/10 text-primary",
          state === "pending" && "bg-muted text-muted-foreground/40",
        )}
      >
        {state === "done" && <Check className="size-3.5" />}
        {state === "active" && <Spinner className="size-3.5" />}
        {state === "pending" && <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span className={cn(state === "pending" ? "text-muted-foreground" : "text-foreground", state === "active" && "font-medium")}>
        {label}
      </span>
    </li>
  );
}

const LINE_WIDTHS = ["w-full", "w-11/12", "w-4/5", "w-3/4"];

function ResumeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {[3, 4, 3].map((lines, section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-4 w-1/4" />
          {Array.from({ length: lines }, (_, line) => (
            <Skeleton key={line} className={cn("h-3", LINE_WIDTHS[line % LINE_WIDTHS.length])} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Compact single-line variant of the loader, used while revising an existing resume. */
export function RotatingStepText({ steps }: { steps: readonly string[] }) {
  const { item } = useRotatingItem(steps);
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner /> {item}…
    </span>
  );
}
