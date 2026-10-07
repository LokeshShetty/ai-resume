import { useRef, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ACCEPT_ATTRIBUTE, MAX_FILE_SIZE_MB } from "@/config/constants";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  id: string;
  onFile: (file: File) => void;
  isParsing?: boolean;
}

export function FileDropzone({ id, onFile, isParsing = false }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-muted/50",
      )}
    >
      {isParsing ? (
        <>
          <Spinner className="size-6 text-primary" />
          <span className="text-sm text-muted-foreground">Extracting text…</span>
        </>
      ) : (
        <>
          <UploadCloud className="size-7 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-medium text-primary">Click to upload</span> or drag and drop
          </span>
          <span className="text-xs text-muted-foreground">PDF, DOCX, TXT or MD · up to {MAX_FILE_SIZE_MB} MB</span>
        </>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        disabled={isParsing}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </label>
  );
}
