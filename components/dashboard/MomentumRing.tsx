import { cn } from "@/lib/utils";

export function MomentumRing({
  value,
  size = 132,
  stroke = 12,
  className,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E4E4E7"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#4338CA"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-2xl font-semibold tabular-nums text-zinc-900"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {Math.round(clamped)}%
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
          of goal
        </span>
      </div>
    </div>
  );
}
