import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUICK_PROMPTS } from "@/config/constants";

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

/** One row of suggestion chips; scrolls horizontally on phones and wraps on larger screens. */
export function QuickPrompts({ onSelect, disabled }: QuickPromptsProps) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
      {QUICK_PROMPTS.map((prompt) => (
        <Button
          key={prompt}
          variant="secondary"
          size="xs"
          className="shrink-0 rounded-full font-normal text-muted-foreground hover:text-primary"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
        >
          <Sparkles />
          {prompt}
        </Button>
      ))}
    </div>
  );
}
