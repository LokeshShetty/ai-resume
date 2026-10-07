import type { ReactNode } from "react";
import { FileText, SlidersHorizontal } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type MobileView = "inputs" | "results";

interface MobileTabBarProps {
  value: MobileView;
  onChange: (view: MobileView) => void;
  isLoading: boolean;
  hasResult: boolean;
}

/** Bottom navigation shown below the `lg` breakpoint, where inputs and results can't sit side by side. */
export function MobileTabBar({ value, onChange, isLoading, hasResult }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden"
    >
      <TabButton active={value === "inputs"} onClick={() => onChange("inputs")} icon={<SlidersHorizontal className="size-5" />}>
        Inputs
      </TabButton>
      <TabButton
        active={value === "results"}
        onClick={() => onChange("results")}
        icon={isLoading ? <Spinner className="size-5" /> : <FileText className="size-5" />}
        dot={hasResult && value !== "results"}
      >
        Resume
      </TabButton>
    </nav>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  dot?: boolean;
  children: ReactNode;
}

function TabButton({ active, onClick, icon, dot, children }: TabButtonProps) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <span className="relative">
        {icon}
        {dot && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />}
      </span>
      {children}
    </button>
  );
}
