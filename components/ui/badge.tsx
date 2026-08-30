import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "paid" | "pending" | "refunded" | "default";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "paid" && "bg-teal-50 text-teal-700",
        variant === "pending" && "bg-amber-50 text-amber-700",
        variant === "refunded" && "bg-zinc-100 text-zinc-500",
        variant === "default" && "bg-zinc-100 text-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
