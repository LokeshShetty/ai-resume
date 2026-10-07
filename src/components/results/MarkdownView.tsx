import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const PROSE =
  "prose prose-neutral prose-sm max-w-none dark:prose-invert " +
  "prose-h1:mb-1 prose-h1:text-2xl prose-h2:mt-6 prose-h2:mb-2 prose-h2:border-b prose-h2:pb-1 " +
  "prose-h2:text-sm prose-h2:uppercase prose-h2:tracking-wide prose-h3:mt-4 prose-h3:mb-1 prose-h3:text-sm " +
  "prose-li:my-0.5 prose-p:my-1.5";

/** Single Markdown renderer shared by the resume preview and chat messages. */
export function MarkdownView({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn(PROSE, className)}>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
