"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { GlassCard } from "./GlassCard";
import type { TierSlice } from "@/lib/dashboard-data";

export function SubscriberTierDonut({ slices }: { slices: TierSlice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  return (
    <GlassCard className="flex h-full flex-col">
      <div className="p-5 pb-2">
        <h3 className="text-sm font-semibold text-zinc-900">Subscriber tiers</h3>
        <p className="text-xs text-zinc-500">Active subscriptions</p>
      </div>
      <div className="relative mx-auto h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums text-zinc-900">
            {total}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            total
          </span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 px-5 pb-5 pt-2">
        {slices.map((s) => (
          <li key={s.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.name}
            </span>
            <span className="font-mono font-medium text-zinc-900">{s.value}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
