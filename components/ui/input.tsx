import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-white/60 bg-white/40 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
