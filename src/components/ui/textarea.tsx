import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-[var(--admin-border)] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[var(--admin-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] disabled:cursor-not-allowed disabled:opacity-50 text-[var(--admin-text)]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
