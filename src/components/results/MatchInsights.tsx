import { Target } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResumeVersion } from "@/types";

const scoreColor = (score: number) =>
  score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-destructive";

function ScoreRing({ score }: { score: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-16">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} className="fill-none stroke-muted" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className={cn("fill-none stroke-current transition-all duration-700", scoreColor(score))}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{score}</span>
    </div>
  );
}

export function MatchInsights({ version }: { version: ResumeVersion }) {
  const { matchScore, missingKeywords } = version;

  return (
    <SectionCard title="Job match" icon={<Target />}>
      <div className="space-y-4">
        {matchScore === null ? (
          <p className="text-sm text-muted-foreground">No match score was returned for this version.</p>
        ) : (
          <div className="flex items-center gap-4">
            <ScoreRing score={matchScore} />
            <div>
              <p className="text-sm font-medium">Estimated match</p>
              <p className="text-xs text-muted-foreground">How well this version aligns with the job description</p>
            </div>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">Gaps to consider</p>
          {missingKeywords.length ? (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No major gaps found.</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
