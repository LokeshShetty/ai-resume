import type { ReactNode } from "react";
import { AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";

const TONES = {
  error: { className: "bg-red-50 text-red-700 ring-red-200", Icon: AlertCircle },
  info: { className: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Info },
};

interface AlertProps {
  tone?: keyof typeof TONES;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Alert({ tone = "error", children, action, className }: AlertProps) {
  const { className: toneClass, Icon } = TONES[tone];
  return (
    <div role="alert" className={cn("flex items-start gap-2 rounded-lg p-3 text-sm ring-1", toneClass, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 whitespace-pre-line break-words">{children}</div>
      {action}
    </div>
  );
}
