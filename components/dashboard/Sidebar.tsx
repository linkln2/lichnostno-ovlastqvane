"use client";

import {
  Bell,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Users,
  TicketCheck,
  BarChart3,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { label: string; icon: LucideIcon; active?: boolean };

export const nav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Events", icon: CalendarDays },
  { label: "Blog", icon: FileText },
  { label: "Products", icon: Package },
  { label: "Orders", icon: Receipt },
  { label: "Registrations", icon: TicketCheck },
  { label: "Subscribers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function Sidebar({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/60 bg-white/45 backdrop-blur-xl md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white/60 dark:hidden"
        />
        <img
          src="/pictures/dark-mode-logo.png"
          alt="Logo"
          className="hidden h-9 w-9 rounded-full object-cover ring-2 ring-white/20 dark:block"
        />
        <span
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Dashboard
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onChange(item.label)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-700",
                isActive
                  ? "bg-indigo-700 text-white"
                  : "text-zinc-500 hover:bg-white/60 hover:text-zinc-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-white/60 bg-white/55 p-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
          </span>
          <span className="text-xs font-medium text-zinc-700">
            Synced with Stripe
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">Last sync 2 min ago</p>
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

export function Topbar({ name = "Maria" }: { name?: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex items-center gap-4 px-6 py-5 md:px-8">
      <div className="min-w-0 flex-1">
        <h1
          className="truncate text-xl font-semibold text-zinc-900 dark:text-white md:text-2xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {greeting}, {name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Here's what's happening in your studio today.</p>
      </div>

      <div className="hidden flex-1 sm:block">
        <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 backdrop-blur-xl">
          <svg className="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search orders, customers, events…"
            className="h-7 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/40 text-zinc-600 backdrop-blur-xl transition-colors hover:text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            window.location.href = "/login";
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/40 text-zinc-600 backdrop-blur-xl transition-colors hover:bg-rose-50 hover:text-rose-600 outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-teal-400 ring-2 ring-white/60" />
      </div>
    </header>
  );
}
