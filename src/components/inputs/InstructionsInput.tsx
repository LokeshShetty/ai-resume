import { MessageSquareText } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Textarea } from "@/components/ui/textarea";
import { QuickPrompts } from "./QuickPrompts";

interface InstructionsInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const appendLine = (current: string, line: string) => (current.trim() ? `${current.trim()}\n${line}` : line);

export function InstructionsInput({ value, onChange, disabled }: InstructionsInputProps) {
  return (
    <SectionCard
      title="Additional instructions"
      description="Optional: guide how the AI rewrites your resume"
      icon={<MessageSquareText />}
    >
      <div className="space-y-3">
        <Textarea
          id="instructions"
          aria-label="Additional instructions"
          rows={3}
          placeholder="e.g. Focus on my backend experience and keep it under 600 words"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <QuickPrompts disabled={disabled} onSelect={(prompt) => onChange(appendLine(value, prompt))} />
      </div>
    </SectionCard>
  );
}
