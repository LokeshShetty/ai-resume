import type { ReactNode } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

/** The app's standard panel: a shadcn Card with an icon, title, optional description and action. */
export function SectionCard({ title, description, icon, action, className, contentClassName, children }: SectionCardProps) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      {/* Flex-wrap (instead of the default grid) lets the action drop below the title in narrow columns. */}
      <CardHeader className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b px-4 py-4 sm:px-5 [.border-b]:pb-4">
        <div className="min-w-0 space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-sm">
            {icon && <span className="text-primary [&_svg]:size-4">{icon}</span>}
            {title}
          </CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {action && <CardAction className="static">{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn("p-4 sm:p-5", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
