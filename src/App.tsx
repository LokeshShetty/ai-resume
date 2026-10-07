import { useState } from "react";
import { InputsPanel } from "@/components/inputs/InputsPanel";
import { Header } from "@/components/layout/Header";
import { MobileTabBar, type MobileView } from "@/components/layout/MobileTabBar";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useSettings } from "@/context/SettingsContext";
import { useResumeSession } from "@/hooks/useResumeSession";
import { cn } from "@/utils/cn";

export default function App() {
  const { isConfigured } = useSettings();
  const session = useResumeSession();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("inputs");
  const openSettings = () => setSettingsOpen(true);

  /** Switching sections on mobile starts the new section from the top. */
  const showView = (view: MobileView) => {
    setMobileView(view);
    window.scrollTo({ top: 0 });
  };

  const tailor = () => {
    showView("results");
    void session.tailor();
  };

  const reset = () => {
    session.reset();
    showView("inputs");
  };

  /** On mobile only the selected section is shown; on desktop both are always visible. */
  const mobileVisibility = (view: MobileView) => (mobileView === view ? "block" : "hidden lg:block");

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onOpenSettings={openSettings} onReset={reset} canReset={session.versions.length > 0} />

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-6 px-3 pt-4 pb-24 sm:px-6 sm:pt-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:pb-6">
        <aside className={cn(mobileVisibility("inputs"), "print:hidden")}>
          <InputsPanel session={session} isConfigured={isConfigured} onTailor={tailor} />
        </aside>
        <div className={mobileVisibility("results")}>
          <ResultsPanel session={session} isConfigured={isConfigured} onOpenSettings={openSettings} />
        </div>
      </main>

      <MobileTabBar
        value={mobileView}
        onChange={showView}
        isLoading={session.isLoading}
        hasResult={session.versions.length > 0}
      />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
