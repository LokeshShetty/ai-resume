import { FileText, RotateCcw, Settings } from "lucide-react";
import { Badge, Button } from "@/components/ui";
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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">AI Resume Tailor</h1>
            <p className="hidden text-xs text-slate-500 sm:block">Tailor your resume to any job in seconds</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex">
            {isConfigured ? (
              <Badge tone="success">
                {PROVIDERS[settings.activeProvider].label} · {activeCredentials.model}
              </Badge>
            ) : (
              <Badge tone="warning">No API key</Badge>
            )}
          </span>
          {canReset && (
            <Button variant="ghost" size="sm" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
              <span className="hidden sm:inline">New session</span>
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<Settings className="h-4 w-4" />} onClick={onOpenSettings} aria-label="Settings">
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
