import { Briefcase, FileUser, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ResumeSession } from "@/hooks/useResumeSession";
import { DocumentInput } from "./DocumentInput";
import { InstructionsInput } from "./InstructionsInput";

interface InputsPanelProps {
  session: ResumeSession;
  isConfigured: boolean;
  onTailor: () => void;
}

export function InputsPanel({ session, isConfigured, onTailor }: InputsPanelProps) {
  const { inputs, isLoading, canTailor, versions } = session;
  const hint = !isConfigured
    ? "Add an API key in settings to get started"
    : !canTailor && !isLoading
      ? "Add a job description and your resume to continue"
      : null;

  return (
    <div className="space-y-4">
      <DocumentInput
        id="job-description"
        title="Job description"
        description="The role you are applying for"
        icon={<Briefcase />}
        placeholder="Paste the full job description here…"
        value={inputs.jobDescription}
        onChange={inputs.setJobDescription}
        disabled={isLoading}
      />
      <DocumentInput
        id="resume"
        title="Your resume"
        description="Your current resume to tailor"
        icon={<FileUser />}
        placeholder="Paste your resume text here…"
        value={inputs.resume}
        onChange={inputs.setResume}
        disabled={isLoading}
      />
      <InstructionsInput value={inputs.instructions} onChange={inputs.setInstructions} disabled={isLoading} />

      <div className="space-y-2">
        <Button size="lg" className="w-full" disabled={isLoading || !canTailor || !isConfigured} onClick={onTailor}>
          {isLoading ? <Spinner /> : <Wand2 />}
          {isLoading ? "Analyzing…" : versions.length ? "Re-tailor from scratch" : "Tailor my resume"}
        </Button>
        {hint && <p className="text-center text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
