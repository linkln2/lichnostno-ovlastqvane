import { ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { EventRow } from "@/lib/dashboard-data";

export function UpcomingEventsList({ events }: { events: EventRow[] }) {
  return (
    <GlassCard className="flex h-full flex-col">
      <div className="p-5 pb-2">
        <h3 className="text-sm font-semibold text-zinc-900">Upcoming events</h3>
        <p className="text-xs text-zinc-500">Next on the calendar</p>
      </div>
      <ul className="flex flex-col px-2 pb-3">
        {events.map((e, i) => (
          <li key={i}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/50 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-700 text-white">
                <span className="font-mono text-base font-semibold leading-none">
                  {e.day}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">
                  {e.mon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {e.title}
                </p>
                <p className="truncate text-xs text-zinc-500">{e.meta}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
            </button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
