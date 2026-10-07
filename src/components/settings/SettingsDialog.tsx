import { useState } from "react";
import { CheckCircle2, ExternalLink, Eye, EyeOff, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { PROVIDER_LIST, PROVIDERS } from "@/config/providers";
import { useSettings } from "@/context/SettingsContext";
import { useProviderModels, type ModelsState } from "@/hooks/useProviderModels";
import { resolveModel } from "@/services/modelOptions";
import type { ProviderId, ProviderSettings, Settings } from "@/types";

const CUSTOM_MODEL = "__custom__";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { settings, saveSettings } = useSettings();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI provider settings</DialogTitle>
          <DialogDescription>
            Bring your own API key. Requests go directly from your browser to the provider.
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so the draft always starts from the saved settings. */}
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
      </DialogContent>
    </Dialog>
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
  const [customModel, setCustomModel] = useState(false);
  const provider = PROVIDERS[draft.activeProvider];
  const current = draft.providers[draft.activeProvider];

  const updateProvider = (patch: Partial<ProviderSettings>) =>
    setDraft((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [prev.activeProvider]: { ...prev.providers[prev.activeProvider], ...patch },
      },
    }));

  // Once the key's real model list arrives, swap out a saved model that is no longer available.
  const models = useProviderModels(draft.activeProvider, current.apiKey, (available) => {
    if (customModel) return;
    setDraft((prev) => {
      const settings = prev.providers[prev.activeProvider];
      const model = resolveModel(settings.model, available);
      return model === settings.model
        ? prev
        : { ...prev, providers: { ...prev.providers, [prev.activeProvider]: { ...settings, model } } };
    });
  });

  const isListed = models.models.some((model) => model.id === current.model);
  const selectValue = customModel ? CUSTOM_MODEL : current.model;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
      }}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="provider">Provider</FieldLabel>
          <NativeSelect
            id="provider"
            className="w-full"
            value={draft.activeProvider}
            onChange={(event) => {
              setCustomModel(false);
              setDraft({ ...draft, activeProvider: event.target.value as ProviderId });
            }}
          >
            {PROVIDER_LIST.map(({ id, label }) => (
              <NativeSelectOption key={id} value={id}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="api-key">API key</FieldLabel>
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={showKey ? "Hide API key" : "Show API key"}
              onClick={() => setShowKey((value) => !value)}
              className="absolute top-1/2 right-0.5 -translate-y-1/2 text-muted-foreground"
            >
              {showKey ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldDescription>
            <a href={provider.keyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
              Get a {provider.label} API key <ExternalLink className="size-3" />
            </a>
          </FieldDescription>
          <KeyStatus state={models} />
        </Field>

        <Field>
          <FieldLabel htmlFor="model">Model</FieldLabel>
          <NativeSelect
            id="model"
            className="w-full"
            value={selectValue}
            onChange={(event) => {
              const isCustom = event.target.value === CUSTOM_MODEL;
              setCustomModel(isCustom);
              if (!isCustom) updateProvider({ model: event.target.value });
            }}
          >
            {!isListed && !customModel && (
              <NativeSelectOption value={current.model}>{current.model} (saved)</NativeSelectOption>
            )}
            {models.models.map((model) => (
              <NativeSelectOption key={model.id} value={model.id}>
                {model.label === model.id ? model.id : `${model.label} (${model.id})`}
              </NativeSelectOption>
            ))}
            <NativeSelectOption value={CUSTOM_MODEL}>Custom model ID…</NativeSelectOption>
          </NativeSelect>
          {customModel && (
            <Input
              aria-label="Custom model ID"
              spellCheck={false}
              placeholder="Exact model ID"
              value={current.model}
              onChange={(event) => updateProvider({ model: event.target.value })}
              className="font-mono"
            />
          )}
        </Field>

        <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          Keys are stored only in this browser's local storage and are only sent to the provider you select. Avoid
          using this on shared computers.
        </p>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!current.model.trim()}>
          Save settings
        </Button>
      </DialogFooter>
    </form>
  );
}

/** Shows whether the key worked, based on the live model list request. */
function KeyStatus({ state }: { state: ModelsState }) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Spinner className="size-3.5" /> Checking key and loading models…
        </p>
      );
    case "success":
      return (
        <p className="flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="size-3.5" /> Key works · {state.models.length} models available
        </p>
      );
    case "error":
      return (
        <p role="alert" className="flex items-start gap-1.5 text-xs text-destructive">
          <TriangleAlert className="mt-px size-3.5 shrink-0" />
          <span className="break-words">Couldn't load models ({state.error}). Showing suggested models instead.</span>
        </p>
      );
  }
}
