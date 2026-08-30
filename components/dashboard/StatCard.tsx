import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

type Accent = "indigo" | "teal" | "amber";

const accentBg: Record<Accent, string> = {
  indigo: "bg-indigo-700",
  teal: "bg-teal-600",
  amber: "bg-amber-500",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  deltaPct,
  accent = "indigo",
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  deltaPct?: number;
  accent?: Accent;
  children?: React.ReactNode;
}) {
  const positive = (deltaPct ?? 0) >= 0;
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-zinc-900">
            {value}
          </p>
          {deltaPct !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  positive ? "text-teal-600" : "text-rose-500",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(deltaPct)}%
              </span>
              <span className="text-zinc-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white",
            accentBg[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {children}
    </GlassCard>
  );
}
