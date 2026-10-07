import { Check } from "lucide-react";
import { Card, Skeleton, SkeletonLines, Spinner } from "@/components/ui";
import { useRotatingItem } from "@/hooks/useRotatingItem";
import { cn } from "@/utils/cn";

interface AnalysisLoaderProps {
  steps: readonly string[];
}

/** Full loading screen: step-by-step progress beside a skeleton of the resume. */
export function AnalysisLoader({ steps }: AnalysisLoaderProps) {
  const { index } = useRotatingItem(steps);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true" aria-live="polite">
      <Card title="Generating your resume" description="This usually takes 20–60 seconds">
        <ResumeSkeleton />
      </Card>
      <Card title="AI is analyzing" icon={<Spinner size="sm" />}>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <StepItem key={step} label={step} state={i < index ? "done" : i === index ? "active" : "pending"} />
          ))}
        </ol>
      </Card>
    </div>
  );
}

type StepState = "done" | "active" | "pending";

function StepItem({ label, state }: { label: string; state: StepState }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          state === "done" && "bg-emerald-100 text-emerald-600",
          state === "active" && "bg-indigo-100 text-indigo-600",
          state === "pending" && "bg-slate-100 text-slate-300",
        )}
      >
        {state === "done" && <Check className="h-3.5 w-3.5" />}
        {state === "active" && <Spinner size="sm" />}
        {state === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <span className={cn(state === "pending" ? "text-slate-400" : "text-slate-700", state === "active" && "font-medium")}>
        {label}
      </span>
    </li>
  );
}

export function ResumeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {[3, 4, 3].map((lines, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <SkeletonLines count={lines} />
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
      <Spinner size="sm" /> {item}…
    </span>
  );
}
