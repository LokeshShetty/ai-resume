import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, MessagesSquare, Send, Square } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { QuickPrompts } from "@/components/inputs/QuickPrompts";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { MarkdownView } from "./MarkdownView";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export function ChatPanel({ messages, isLoading, onSend, onCancel }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll only the message list (not the page) so new messages are visible.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages.length, isLoading]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!draft.trim() || isLoading) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <SectionCard
      title="Refine with AI"
      description="Ask for changes and get a new version"
      icon={<MessagesSquare />}
      contentClassName="flex flex-col p-0 sm:p-0"
    >
      <div ref={listRef} className="max-h-[420px] min-h-[160px] flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 ? (
          <Empty className="p-4 md:p-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bot />
              </EmptyMedia>
              <EmptyTitle className="text-sm">No messages yet</EmptyTitle>
              <EmptyDescription>Tell the AI what to change, e.g. “make the summary punchier”.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        )}
        {isLoading && <TypingIndicator />}
      </div>

      <form onSubmit={submit} className="space-y-2 border-t px-4 py-4 sm:px-5">
        <QuickPrompts disabled={isLoading} onSelect={onSend} />
        <div className="flex items-end gap-2">
          <Textarea
            aria-label="Ask for changes"
            rows={2}
            className="min-h-0"
            placeholder="Describe the changes you want…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) submit(event);
            }}
          />
          {isLoading ? (
            <Button type="button" variant="outline" size="icon" aria-label="Stop" onClick={onCancel}>
              <Square />
            </Button>
          ) : (
            <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()}>
              <Send />
            </Button>
          )}
        </div>
      </form>
    </SectionCard>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-3.5 py-2 text-sm",
          isUser ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownView content={message.content} className="prose-p:my-1" />
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3" aria-label="AI is typing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
