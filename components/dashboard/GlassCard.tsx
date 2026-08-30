import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/55 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
