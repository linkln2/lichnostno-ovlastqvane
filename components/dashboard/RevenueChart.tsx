"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "./GlassCard";
import { revenue7d, revenue30d, revenue90d, type RevenuePoint } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const ranges: Record<"7d" | "30d" | "90d", RevenuePoint[]> = {
  "7d": revenue7d,
  "30d": revenue30d,
  "90d": revenue90d,
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as RevenuePoint;
  return (
    <div className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-xs shadow-sm backdrop-blur-xl">
      <p className="text-zinc-500">{fmtDate(p.d)}</p>
      <p className="font-mono font-semibold text-zinc-900">
        €{p.v.toLocaleString()}
      </p>
    </div>
  );
}

export function RevenueChart() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const data = ranges[range];

  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-center justify-between gap-4 p-5 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Revenue trend</h3>
          <p className="text-xs text-zinc-500">Gross revenue over time</p>
        </div>
        <div className="inline-flex rounded-full border border-white/60 bg-white/40 p-0.5">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-700",
                range === r
                  ? "bg-indigo-700 text-white"
                  : "text-zinc-500 hover:text-zinc-900",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338CA" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E4E4E7" strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="d"
              tickFormatter={fmtDate}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#A1A1AA", fontSize: 11 }}
              width={48}
              tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#4338CA", strokeOpacity: 0.3 }} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#4338CA"
              strokeWidth={2}
              fill="url(#revFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
