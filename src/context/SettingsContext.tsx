import { createContext, useContext, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import { DEFAULT_SETTINGS } from "@/config/providers";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { ProviderSettings, Settings } from "@/types";

interface SettingsContextValue {
  settings: Settings;
  saveSettings: (settings: Settings) => void;
  activeCredentials: ProviderSettings;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, saveSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);

  const value = useMemo(() => {
    const activeCredentials = settings.providers[settings.activeProvider];
    return {
      settings,
      saveSettings,
      activeCredentials,
      isConfigured: Boolean(activeCredentials.apiKey.trim() && activeCredentials.model.trim()),
    };
  }, [settings, saveSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
