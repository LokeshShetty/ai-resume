import { FileText, RotateCcw, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROVIDERS } from "@/config/providers";
import { useSettings } from "@/context/SettingsContext";

interface HeaderProps {
  onOpenSettings: () => void;
  onReset: () => void;
  canReset: boolean;
}

export function Header({ onOpenSettings, onReset, canReset }: HeaderProps) {
  const { settings, activeCredentials, isConfigured } = useSettings();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">AI Resume Tailor</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Tailor your resume to any job in seconds</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConfigured ? (
            <Badge variant="secondary" className="hidden md:inline-flex">
              {PROVIDERS[settings.activeProvider].label} · {activeCredentials.model}
            </Badge>
          ) : (
            <Badge variant="outline" className="hidden border-amber-300 text-amber-700 md:inline-flex">
              No API key
            </Badge>
          )}
          {canReset && (
            <Button variant="ghost" size="sm" aria-label="New session" onClick={onReset}>
              <RotateCcw />
              <span className="hidden sm:inline">New session</span>
            </Button>
          )}
          <Button variant="outline" size="sm" aria-label="Settings" onClick={onOpenSettings}>
            <Settings />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
