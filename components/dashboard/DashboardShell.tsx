"use client";

import { useState, useEffect } from "react";
import { Sidebar, Topbar, nav } from "./Sidebar";
import { StatCard } from "./StatCard";
import { MomentumRing } from "./MomentumRing";
import { RevenueChart } from "./RevenueChart";
import { UpcomingEventsList } from "./UpcomingEventsList";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { SubscriberTierDonut } from "./SubscriberTierDonut";
import {
  EventsTab,
  BlogTab,
  ProductsTab,
  OrdersTab,
  RegistrationsTab,
  SubscribersTab,
  AnalyticsTab,
  SettingsTab,
} from "./tabs";
import { CalendarClock, CircleDollarSign, Users, Ticket } from "lucide-react";

type Stats = {
  revenue30d: number;
  revenueBySource: Record<string, number>;
  activeSubscribers: number;
  subsByTier: Record<string, number>;
  upcomingEvents: { id: number; title: string; startsAt: string; location: string }[];
  upcomingEventsCount: number;
  recentOrders: { id: number; status: string; totalCents: number; source: string; createdAt: string }[];
  totalRegistrations: number;
  prevRevenue30d: number;
  prevActiveSubscribers: number;
};

function fmtEur(cents: number) {
  return `€${(cents / 100).toFixed(0)}`;
}

function deltaPct(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

export function DashboardShell() {
  const [active, setActive] = useState("Overview");
  const [userName, setUserName] = useState("Valeria");

  // Sync active tab with URL hash (e.g. /dashboard#products)
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = nav.find((n) => n.label.toLowerCase() === hash.toLowerCase());
        if (found) setActive(found.label);
      } else {
        setActive("Overview");
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function handleChange(tab: string) {
    setActive(tab);
    const slug = tab.toLowerCase();
    window.location.hash = slug;
  }

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.name) setUserName(d.user.name);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex">
      <Sidebar active={active} onChange={handleChange} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar name={userName} />

        <main className="flex flex-1 flex-col gap-6 px-6 pb-24 md:px-8 md:pb-10">
          {active === "Overview" && <OverviewTab />}
          {active === "Events" && <EventsTab />}
          {active === "Blog" && <BlogTab />}
          {active === "Products" && <ProductsTab />}
          {active === "Orders" && <OrdersTab />}
          {active === "Registrations" && <RegistrationsTab />}
          {active === "Subscribers" && <SubscribersTab />}
          {active === "Analytics" && <AnalyticsTab />}
          {active === "Settings" && <SettingsTab />}
        </main>

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/80 px-2 py-2 backdrop-blur-xl md:hidden">
          <ul className="flex justify-around">
            {nav.map((item) => {
              const isActive = active === item.label;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleChange(item.label)}
                    className={`flex flex-col items-center gap-0.5 rounded-lg p-1 text-[10px] font-medium ${
                      isActive ? "text-indigo-700" : "text-zinc-500"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setStats(d);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600">
        {error || "No data available"}
      </div>
    );
  }

  const revenueDelta = deltaPct(stats.revenue30d, stats.prevRevenue30d);
  const subsDelta = deltaPct(stats.activeSubscribers, stats.prevActiveSubscribers);

  // Build tier slices for donut
  const tierSlices = Object.entries(stats.subsByTier).map(([name, count], i) => ({
    name,
    value: count,
    color: ["#6366f1", "#14b8a6", "#f59e0b", "#ec4899"][i % 4],
  }));

  // Build upcoming events in the format the component expects
  const upcomingEventsAdapted = stats.upcomingEvents.map((e) => {
    const d = new Date(e.startsAt);
    return {
      day: String(d.getDate()),
      mon: d.toLocaleDateString("en", { month: "short" }),
      title: e.title,
      meta: e.location,
    };
  });

  // Build recent orders in the format the component expects
  const recentOrdersAdapted = stats.recentOrders.map((o) => ({
    id: String(o.id),
    customer: o.source || "—",
    item: o.source || "—",
    amount: fmtEur(o.totalCents),
    status: o.status === "paid" ? "Paid" : o.status === "refunded" ? "Refunded" : "Pending" as "Paid" | "Pending" | "Refunded",
  }));

  return (
    <>
      {/* Stat row */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label="Revenue (30d)"
          value={fmtEur(stats.revenue30d)}
          deltaPct={revenueDelta}
          accent="teal"
        />
        <StatCard
          icon={Users}
          label="Active subscribers"
          value={String(stats.activeSubscribers)}
          deltaPct={subsDelta}
          accent="indigo"
        />
        <StatCard
          icon={CalendarClock}
          label="Upcoming events"
          value={String(stats.upcomingEventsCount)}
          accent="amber"
        />
        <StatCard
          icon={Ticket}
          label="Registrations"
          value={String(stats.totalRegistrations)}
          accent="indigo"
        />
      </section>

      {/* Revenue breakdown by source */}
      <section className="rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Revenue by source (30d)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <RevenueSourceCard
            label="Shop"
            cents={stats.revenueBySource.shop || 0}
            color="bg-teal-500"
          />
          <RevenueSourceCard
            label="Events"
            cents={stats.revenueBySource.event || 0}
            color="bg-amber-500"
          />
          <RevenueSourceCard
            label="Subscriptions"
            cents={stats.revenueBySource.subscription || 0}
            color="bg-indigo-500"
          />
        </div>
      </section>

      {/* Revenue chart + upcoming events */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEventsList events={upcomingEventsAdapted} />
        </div>
      </section>

      {/* Recent orders + subscriber donut */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrdersAdapted} />
        </div>
        <div className="lg:col-span-1">
          {tierSlices.length > 0 ? (
            <SubscriberTierDonut slices={tierSlices} />
          ) : (
            <div className="rounded-2xl border border-white/60 bg-white/40 p-6 text-center text-sm text-zinc-400">
              No active subscribers yet
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function RevenueSourceCard({ label, cents, color }: { label: string; cents: number; color: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/40 p-4">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-xs font-medium text-zinc-500">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{fmtEur(cents)}</p>
    </div>
  );
}
