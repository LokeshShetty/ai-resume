import { useState } from "react";
import { Check, Code, Copy, Download, Eye, Printer } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopy } from "@/hooks/useCopy";
import type { ResumeVersion } from "@/types";
import { downloadFile } from "@/utils/file";
import { formatTime } from "@/utils/format";
import { MarkdownView } from "./MarkdownView";

type ViewMode = "preview" | "markdown";

interface ResumePreviewProps {
  version: ResumeVersion;
  versions: ResumeVersion[];
  onSelectVersion: (id: string) => void;
}

export function ResumePreview({ version, versions, onSelectVersion }: ResumePreviewProps) {
  const [view, setView] = useState<ViewMode>("preview");
  const { copied, copy } = useCopy();

  return (
    <SectionCard
      title="Tailored resume"
      description="Review the result, then refine it with the assistant"
      contentClassName="p-0 sm:p-0"
      action={
        <Tabs value={view} onValueChange={(next) => setView(next as ViewMode)}>
          <TabsList aria-label="Resume view">
            <TabsTrigger value="preview">
              <Eye /> Preview
            </TabsTrigger>
            <TabsTrigger value="markdown">
              <Code /> Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 sm:px-5 print:hidden">
        <NativeSelect
          aria-label="Resume version"
          size="sm"
          className="w-full text-xs sm:w-60"
          value={version.id}
          onChange={(event) => onSelectVersion(event.target.value)}
        >
          {versions.map((v, i) => (
            <NativeSelectOption key={v.id} value={v.id}>
              v{i + 1} · {v.label} · {formatTime(v.createdAt)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => copy(version.resume)}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadFile(version.resume, "resume.md", "text/markdown")}>
            <Download /> .md
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer /> PDF
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto rounded-b-xl bg-muted/50 p-2 sm:max-h-[75vh] sm:p-6">
        {view === "preview" ? (
          <article className="print-area mx-auto max-w-[820px] rounded-md border bg-background px-5 py-6 shadow-xs sm:px-12 sm:py-10">
            <MarkdownView content={version.resume} />
          </article>
        ) : (
          <pre className="rounded-md border bg-background p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {version.resume}
          </pre>
        )}
      </div>
    </SectionCard>
  );
}
