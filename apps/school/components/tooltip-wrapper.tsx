"use client";

import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { ComponentProps } from "react";

export function TooltipWrapper({
  label,
  command,
  className,
  children,
  ...props
}: ComponentProps<typeof TooltipTrigger> & {
  label: string;
  command?: React.ReactNode;
}) {
  return (
    <Tooltip key={label}>
      <TooltipTrigger className={cn(className)} {...props}>
        {children}
      </TooltipTrigger>

      <TooltipContent>
        <span className="flex items-center gap-[1ch]">
          {label}
          {command && (
            <kbd className="bg-muted text-muted-foreground flex items-center gap-[0.5ch] rounded px-1.5 py-0.5 font-mono text-xs [&>svg]:size-3">
              {command}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
