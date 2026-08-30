import * as React from "react";
import { cn } from "@/lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white/40 disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "h-9 px-4 text-sm",
        size === "sm" && "h-8 px-3 text-xs",
        size === "icon" && "h-9 w-9",
        variant === "default" &&
          "bg-indigo-700 text-white hover:bg-indigo-800",
        variant === "ghost" && "text-zinc-600 hover:bg-white/60 hover:text-zinc-900",
        variant === "outline" &&
          "border border-white/60 bg-white/40 text-zinc-700 hover:bg-white/70",
        className,
      )}
      {...props}
    />
  );
}

export { Button };
