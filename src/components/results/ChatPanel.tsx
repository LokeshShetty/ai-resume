import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, MessagesSquare, Send, Square } from "lucide-react";
import { QuickPrompts } from "@/components/inputs/QuickPrompts";
import { Button, Card, EmptyState, TextArea } from "@/components/ui";
import type { ChatMessage } from "@/types";
import { cn } from "@/utils/cn";
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
    <Card
      title="Refine with AI"
      description="Ask for changes and get a new version"
      icon={<MessagesSquare className="h-4 w-4" />}
      bodyClassName="flex flex-col gap-3 p-0"
    >
      <div ref={listRef} className="max-h-[420px] min-h-[160px] flex-1 space-y-3 overflow-y-auto px-4 pt-4 sm:px-5">
        {messages.length === 0 ? (
          <EmptyState
            className="py-6"
            icon={<Bot className="h-5 w-5" />}
            title="No messages yet"
            description="Tell the AI what to change, e.g. “make the summary punchier”."
          />
        ) : (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        )}
        {isLoading && <TypingIndicator />}
      </div>

      <form onSubmit={submit} className="space-y-2 border-t border-slate-100 px-4 py-4 sm:px-5">
        <QuickPrompts disabled={isLoading} onSelect={onSend} />
        <div className="flex items-end gap-2">
          <TextArea
            aria-label="Ask for changes"
            rows={2}
            placeholder="Describe the changes you want…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) submit(event);
            }}
          />
          {isLoading ? (
            <Button variant="danger" size="icon" aria-label="Stop" onClick={onCancel} icon={<Square className="h-4 w-4" />} />
          ) : (
            <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()} icon={<Send className="h-4 w-4" />} />
          )}
        </div>
      </form>
    </Card>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-3.5 py-2 text-sm",
          isUser ? "rounded-br-sm bg-indigo-600 text-white" : "rounded-bl-sm bg-slate-100 text-slate-800",
        )}
      >
        {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <MarkdownView content={message.content} className="prose-p:my-1" />}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-slate-100 px-3.5 py-3" aria-label="AI is typing">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}
