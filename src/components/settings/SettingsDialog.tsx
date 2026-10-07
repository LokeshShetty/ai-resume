import { useState } from "react";
import { ExternalLink, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button, Field, Input, Modal, Select } from "@/components/ui";
import { PROVIDER_LIST, PROVIDERS } from "@/config/providers";
import { useSettings } from "@/context/SettingsContext";
import type { ProviderId, ProviderSettings, Settings } from "@/types";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { settings, saveSettings } = useSettings();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AI provider settings"
      description="Bring your own API key. Requests go directly from your browser to the provider."
    >
      {/* Remount on open so the draft always starts from the saved settings. */}
      {open && (
        <SettingsForm
          initial={settings}
          onCancel={onClose}
          onSave={(next) => {
            saveSettings(next);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}

interface SettingsFormProps {
  initial: Settings;
  onSave: (settings: Settings) => void;
  onCancel: () => void;
}

function SettingsForm({ initial, onSave, onCancel }: SettingsFormProps) {
  const [draft, setDraft] = useState(initial);
  const [showKey, setShowKey] = useState(false);
  const provider = PROVIDERS[draft.activeProvider];
  const current = draft.providers[draft.activeProvider];

  const updateProvider = (patch: Partial<ProviderSettings>) =>
    setDraft((prev) => ({
      ...prev,
      providers: { ...prev.providers, [prev.activeProvider]: { ...current, ...patch } },
    }));

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <Field label="Provider" htmlFor="provider">
        <Select
          id="provider"
          value={draft.activeProvider}
          onChange={(event) => setDraft({ ...draft, activeProvider: event.target.value as ProviderId })}
        >
          {PROVIDER_LIST.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="API key"
        htmlFor="api-key"
        hint={
          <a href={provider.keyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
            Get a {provider.label} API key <ExternalLink className="h-3 w-3" />
          </a>
        }
      >
        <div className="relative">
          <Input
            id="api-key"
            type={showKey ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder={provider.keyPlaceholder}
            value={current.apiKey}
            onChange={(event) => updateProvider({ apiKey: event.target.value })}
            className="pr-10 font-mono"
          />
          <button
            type="button"
            aria-label={showKey ? "Hide API key" : "Show API key"}
            onClick={() => setShowKey((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <Field label="Model" htmlFor="model" hint="Pick a suggestion or type any model ID your key has access to.">
        <Input
          id="model"
          list="model-options"
          spellCheck={false}
          value={current.model}
          onChange={(event) => updateProvider({ model: event.target.value })}
          className="font-mono"
        />
        <datalist id="model-options">
          {provider.models.map((model) => (
            <option key={model} value={model} />
          ))}
        </datalist>
      </Field>

      <p className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        Keys are stored only in this browser's local storage and are never sent anywhere except the selected provider.
        Avoid using this on shared computers.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
