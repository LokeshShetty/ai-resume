import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-slate-200/80", className)} />;
}

/** Several lines of skeleton text with natural-looking varied widths. */
export function SkeletonLines({ count = 3, className }: { count?: number; className?: string }) {
  const widths = ["w-full", "w-11/12", "w-4/5", "w-3/4", "w-5/6"];
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", widths[i % widths.length])} />
      ))}
    </div>
  );
}
