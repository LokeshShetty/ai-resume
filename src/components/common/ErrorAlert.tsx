import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <AlertCircle />
      <AlertDescription className="whitespace-pre-line break-words">{message}</AlertDescription>
      {onRetry && (
        <Button variant="outline" size="sm" className="col-start-2 mt-2 w-fit" onClick={onRetry}>
          <RefreshCw /> Retry
        </Button>
      )}
    </Alert>
  );
}
