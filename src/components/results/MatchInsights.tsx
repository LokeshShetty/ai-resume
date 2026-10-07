import { Target } from "lucide-react";
import { Badge, Card, type BadgeTone } from "@/components/ui";
import type { ResumeVersion } from "@/types";

const scoreTone = (score: number): BadgeTone => (score >= 75 ? "success" : score >= 50 ? "warning" : "danger");

const SCORE_COLORS: Record<BadgeTone, string> = {
  success: "text-emerald-500",
  warning: "text-amber-500",
  danger: "text-red-500",
  neutral: "text-slate-400",
  brand: "text-indigo-500",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} className="fill-none stroke-slate-100" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className={`fill-none stroke-current transition-all duration-700 ${SCORE_COLORS[scoreTone(score)]}`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900">{score}</span>
    </div>
  );
}

export function MatchInsights({ version }: { version: ResumeVersion }) {
  const { matchScore, missingKeywords } = version;

  return (
    <Card title="Job match" icon={<Target className="h-4 w-4" />}>
      <div className="space-y-4">
        {matchScore === null ? (
          <p className="text-sm text-slate-500">No match score was returned for this version.</p>
        ) : (
          <div className="flex items-center gap-4">
            <ScoreRing score={matchScore} />
            <div>
              <p className="text-sm font-medium text-slate-900">Estimated match</p>
              <p className="text-xs text-slate-500">How well this version aligns with the job description</p>
            </div>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Gaps to consider</p>
          {missingKeywords.length ? (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((keyword) => (
                <Badge key={keyword} tone="warning">
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No major gaps found — nice!</p>
          )}
        </div>
      </div>
    </Card>
  );
}
