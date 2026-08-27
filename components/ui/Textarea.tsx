import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-md border border-border-strong bg-bg-raised px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors",
        "focus:border-accent-border focus:ring-2 focus:ring-accent/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
