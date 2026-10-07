import { useState } from "react";
import { Check, Code, Copy, Download, Eye, Printer } from "lucide-react";
import { Button, Card, SegmentedControl, Select, type SegmentOption } from "@/components/ui";
import { useCopy } from "@/hooks/useCopy";
import type { ResumeVersion } from "@/types";
import { downloadFile } from "@/utils/file";
import { formatTime } from "@/utils/format";
import { MarkdownView } from "./MarkdownView";

type ViewMode = "preview" | "markdown";

const VIEW_OPTIONS: SegmentOption<ViewMode>[] = [
  { value: "preview", label: "Preview", icon: <Eye className="h-3.5 w-3.5" /> },
  { value: "markdown", label: "Markdown", icon: <Code className="h-3.5 w-3.5" /> },
];

interface ResumePreviewProps {
  version: ResumeVersion;
  versions: ResumeVersion[];
  onSelectVersion: (id: string) => void;
}

export function ResumePreview({ version, versions, onSelectVersion }: ResumePreviewProps) {
  const [view, setView] = useState<ViewMode>("preview");
  const { copied, copy } = useCopy();

  return (
    <Card
      title="Tailored resume"
      description="Review the result, then refine it with the assistant"
      bodyClassName="p-0"
      actions={<SegmentedControl ariaLabel="Resume view" options={VIEW_OPTIONS} value={view} onChange={setView} />}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 sm:px-5 print:hidden">
        <div className="w-full sm:w-60">
          <Select
            aria-label="Resume version"
            className="h-8 py-0 text-xs"
            value={version.id}
            onChange={(event) => onSelectVersion(event.target.value)}
          >
            {versions.map((v, i) => (
              <option key={v.id} value={v.id}>
                v{i + 1} · {v.label} · {formatTime(v.createdAt)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            onClick={() => copy(version.resume)}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={() => downloadFile(version.resume, "resume.md", "text/markdown")}
          >
            .md
          </Button>
          <Button variant="secondary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
            PDF
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto bg-slate-50 p-2 sm:max-h-[75vh] sm:p-6">
        {view === "preview" ? (
          <article className="print-area mx-auto max-w-[820px] rounded-md bg-white px-5 py-6 shadow-sm ring-1 ring-slate-200 sm:px-12 sm:py-10">
            <MarkdownView content={version.resume} />
          </article>
        ) : (
          <pre className="whitespace-pre-wrap rounded-md bg-white p-4 font-mono text-xs leading-relaxed text-slate-700 ring-1 ring-slate-200">
            {version.resume}
          </pre>
        )}
      </div>
    </Card>
  );
}
