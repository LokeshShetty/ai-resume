import { useState, type ReactNode } from "react";
import { ClipboardPaste, FileText, Upload, X } from "lucide-react";
import { Alert, Button, Card, SegmentedControl, TextArea, type SegmentOption } from "@/components/ui";
import { useFileText } from "@/hooks/useFileText";
import type { SourceDocument } from "@/types";
import { wordCount } from "@/utils/format";
import { FileDropzone } from "./FileDropzone";

type InputMode = "upload" | "paste";

const MODE_OPTIONS: SegmentOption<InputMode>[] = [
  { value: "upload", label: "Upload", icon: <Upload className="h-3.5 w-3.5" /> },
  { value: "paste", label: "Paste", icon: <ClipboardPaste className="h-3.5 w-3.5" /> },
];

interface DocumentInputProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  placeholder: string;
  value: SourceDocument;
  onChange: (value: SourceDocument) => void;
  disabled?: boolean;
}

/** Upload-or-paste input used for both the job description and the resume. */
export function DocumentInput({ id, title, description, icon, placeholder, value, onChange, disabled }: DocumentInputProps) {
  const [mode, setMode] = useState<InputMode>("upload");
  const { parse, isParsing, error, clearError } = useFileText((text, fileName) => onChange({ text, fileName }));
  const hasContent = Boolean(value.text.trim());
  const clear = () => onChange({ text: "", fileName: null });
  const changeMode = (next: InputMode) => {
    clearError();
    setMode(next);
  };

  const renderBody = () => {
    if (value.fileName) {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
          <FileText className="h-8 w-8 shrink-0 text-indigo-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{value.fileName}</p>
            <p className="text-xs text-slate-500">{wordCount(value.text)} words extracted</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${value.fileName}`}
            onClick={clear}
            disabled={disabled}
            icon={<X className="h-4 w-4" />}
          />
        </div>
      );
    }
    if (mode === "upload") return <FileDropzone id={`${id}-file`} onFile={parse} isParsing={isParsing} />;
    return (
      <TextArea
        id={`${id}-text`}
        aria-label={title}
        rows={8}
        placeholder={placeholder}
        value={value.text}
        disabled={disabled}
        onChange={(event) => onChange({ text: event.target.value, fileName: null })}
      />
    );
  };

  return (
    <Card
      title={title}
      description={description}
      icon={icon}
      actions={
        !value.fileName && <SegmentedControl ariaLabel={`${title} input mode`} options={MODE_OPTIONS} value={mode} onChange={changeMode} />
      }
    >
      <div className="space-y-3">
        {renderBody()}
        {error && <Alert>{error}</Alert>}
        {mode === "paste" && !value.fileName && hasContent && (
          <p className="text-right text-xs text-slate-400">{wordCount(value.text)} words</p>
        )}
      </div>
    </Card>
  );
}
