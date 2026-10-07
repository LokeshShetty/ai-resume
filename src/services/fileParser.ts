import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from "@/config/constants";
import { getExtension } from "@/utils/file";

type Extension = keyof typeof ACCEPTED_FILE_TYPES;
type Parser = (file: File) => Promise<string>;

const parsePdf: Parser = async (file) => {
  const pdfjs = await import("pdfjs-dist");
  const { default: workerUrl } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, index) => {
      const page = await pdf.getPage(index + 1);
      const content = await page.getTextContent();
      return content.items
        .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : " ") : ""))
        .join("");
    }),
  );
  return pages.join("\n\n");
};

const parseDocx: Parser = async (file) => {
  const mammoth = await import("mammoth");
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return value;
};

const parseText: Parser = (file) => file.text();

const PARSERS: Record<Extension, Parser> = {
  ".pdf": parsePdf,
  ".docx": parseDocx,
  ".txt": parseText,
  ".md": parseText,
};

const isSupported = (extension: string): extension is Extension => extension in PARSERS;

/** Extracts plain text from a supported document. Throws a user-friendly error otherwise. */
export async function extractText(file: File): Promise<string> {
  const extension = getExtension(file.name);
  if (!isSupported(extension)) {
    throw new Error(`Unsupported file type. Please upload ${Object.keys(PARSERS).join(", ")}.`);
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
  }

  const text = (await PARSERS[extension](file)).replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("No readable text found in this file. Try pasting the content instead.");
  return text;
}
