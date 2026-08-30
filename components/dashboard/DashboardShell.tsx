"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "./Sidebar";
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
  SubscribersTab,
  SettingsTab,
} from "./tabs";
import {
  recentOrders,
  tierSlices,
  upcomingEvents,
} from "@/lib/dashboard-data";
import { CalendarClock, CircleDollarSign, Users } from "lucide-react";

export function DashboardShell() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="flex">
      <Sidebar active={active} onChange={setActive} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar name="Maria" />

        <main className="flex flex-1 flex-col gap-6 px-6 pb-10 md:px-8">
          {active === "Overview" && <OverviewTab />}
          {active === "Events" && <EventsTab />}
          {active === "Blog" && <BlogTab />}
          {active === "Products" && <ProductsTab />}
          {active === "Orders" && <OrdersTab />}
          {active === "Subscribers" && <SubscribersTab />}
          {active === "Settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      {/* Stat row */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label="Monthly goal"
          value="€18,420"
          deltaPct={12}
          accent="indigo"
        >
          <div className="mt-4 flex items-center justify-center">
            <MomentumRing value={68} />
          </div>
        </StatCard>

        <StatCard
          icon={CircleDollarSign}
          label="Revenue (30d)"
          value="€12,840"
          deltaPct={8}
          accent="teal"
        />
        <StatCard
          icon={Users}
          label="Subscribers"
          value="388"
          deltaPct={5}
          accent="indigo"
        />
        <StatCard
          icon={CalendarClock}
          label="Upcoming events"
          value="4"
          deltaPct={-2}
          accent="amber"
        />
      </section>

      {/* Revenue chart + upcoming events */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEventsList events={upcomingEvents} />
        </div>
      </section>

      {/* Recent orders + subscriber donut */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <SubscriberTierDonut slices={tierSlices} />
        </div>
      </section>
    </>
  );
}
