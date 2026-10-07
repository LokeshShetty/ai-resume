import { MarkdownView } from "./MarkdownView";

/**
 * Print-only copy of the resume, rendered outside the scrollable layout
 * so "Print to PDF" always gets the whole document across pages.
 */
export function PrintableResume({ content }: { content: string }) {
  return (
    <div className="hidden print:block">
      <MarkdownView content={content} />
    </div>
  );
}
