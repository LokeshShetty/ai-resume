import { useState, type ReactNode } from "react";
import { AlertCircle, ClipboardPaste, FileText, Upload, X } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFileText } from "@/hooks/useFileText";
import type { SourceDocument } from "@/types";
import { wordCount } from "@/utils/format";
import { FileDropzone } from "./FileDropzone";

type InputMode = "upload" | "paste";

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

  const changeMode = (next: string) => {
    clearError();
    setMode(next as InputMode);
  };

  if (value.fileName) {
    return (
      <SectionCard title={title} description={description} icon={icon}>
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <FileText className="size-8 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.fileName}</p>
            <p className="text-xs text-muted-foreground">{wordCount(value.text)} words extracted</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${value.fileName}`}
            disabled={disabled}
            onClick={() => onChange({ text: "", fileName: null })}
          >
            <X />
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <Tabs value={mode} onValueChange={changeMode}>
      <SectionCard
        title={title}
        description={description}
        icon={icon}
        action={
          <TabsList aria-label={`${title} input mode`}>
            <TabsTrigger value="upload">
              <Upload /> Upload
            </TabsTrigger>
            <TabsTrigger value="paste">
              <ClipboardPaste /> Paste
            </TabsTrigger>
          </TabsList>
        }
      >
        <TabsContent value="upload" className="space-y-3">
          <FileDropzone id={`${id}-file`} onFile={parse} isParsing={isParsing} />
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="paste" className="space-y-1.5">
          <Textarea
            id={`${id}-text`}
            aria-label={title}
            rows={8}
            className="max-h-80"
            placeholder={placeholder}
            value={value.text}
            disabled={disabled}
            onChange={(event) => onChange({ text: event.target.value, fileName: null })}
          />
          {value.text.trim() && <p className="text-right text-xs text-muted-foreground">{wordCount(value.text)} words</p>}
        </TabsContent>
      </SectionCard>
    </Tabs>
  );
}
