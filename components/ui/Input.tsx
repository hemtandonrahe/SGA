import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border-strong bg-bg-raised px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors",
        "focus:border-accent-border focus:ring-2 focus:ring-accent/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
