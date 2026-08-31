"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { StarfieldBackground } from "@/components/StarfieldBackground";

type Entitlements = {
  customerId: string;
  email: string;
  hasActiveMembership: boolean;
  highestTierName: string | null;
  highestTierPrice: number | null;
  memberships: {
    tierName: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }[];
  eventTickets: {
    eventTitle: string;
    eventSlug: string;
    eventStartsAt: string | null;
    status: string;
  }[];
  products: {
    productName: string;
    fulfilled: boolean;
  }[];
};

type Tab = "overview" | "memberships" | "tickets" | "products";

export default function AccountPage() {
  const { locale } = useLocale();
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    fetch("/api/entitlements")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/membership";
          return null;
        }
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => {
        if (data) setEntitlements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  }

  const t = {
    title: locale === "bg" ? "Профил" : "Account",
    logout: locale === "bg" ? "Изход" : "Log out",
    overview: locale === "bg" ? "Обзор" : "Overview",
    memberships: locale === "bg" ? "Членство" : "Membership",
    tickets: locale === "bg" ? "Билети" : "Tickets",
    products: locale === "bg" ? "Продукти" : "Products",
    innerCircle: locale === "bg" ? "Вътрешен кръг" : "Inner Circle",
    welcome: locale === "bg" ? "Здравей" : "Welcome",
    noMemberships: locale === "bg" ? "Нямате активен абонамент." : "No active subscription.",
    noTickets: locale === "bg" ? "Нямате билети за събития." : "No event tickets yet.",
    noProducts: locale === "bg" ? "Нямате закупени продукти." : "No purchased products.",
    becomeMember: locale === "bg" ? "Стани член" : "Become a member",
    manage: locale === "bg" ? "Управление" : "Manage",
    viewTicket: locale === "bg" ? "Виж билета" : "View ticket",
    nextBilling: locale === "bg" ? "Следващо плащане" : "Next billing",
    status: locale === "bg" ? "Статус" : "Status",
    rank: locale === "bg" ? "Ранг" : "Rank",
    none: locale === "bg" ? "Няма" : "None",
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    checked_in: "bg-green-100 text-green-700",
    waitlisted: "bg-amber-100 text-amber-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-rose-100 text-rose-700",
    active: "bg-green-100 text-green-700",
    trialing: "bg-amber-100 text-amber-700",
    past_due: "bg-rose-100 text-rose-700",
    incomplete: "bg-stone-100 text-stone-500",
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-stone-500">Loading…</div>
      </div>
    );
  }

  if (!entitlements) return null;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "overview", label: t.overview, count: 0 },
    { key: "memberships", label: t.memberships, count: entitlements.memberships.length },
    { key: "tickets", label: t.tickets, count: entitlements.eventTickets.length },
    { key: "products", label: t.products, count: entitlements.products.length },
  ];

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-900">
      <StarfieldBackground className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{t.title}</h1>
            <p className="mt-1 text-sm text-stone-500">{entitlements.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {entitlements.hasActiveMembership && (
              <Link
                href="/inner-circle"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all hover:shadow-md"
                style={{ backgroundColor: "#fbbf24", color: "#000000" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {t.innerCircle}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              {t.logout}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-stone-200">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === tabItem.key
                  ? "border-amber-600 text-amber-700"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
            >
              {tabItem.label}
              {tabItem.count > 0 && (
                <span className="rounded-full bg-stone-200 px-1.5 py-0.5 text-xs text-stone-600">
                  {tabItem.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {/* Overview */}
          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Rank card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:bg-stone-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">{t.rank}</h3>
                <p className="mt-2 text-lg font-bold text-stone-900">
                  {entitlements.highestTierName || t.none}
                </p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  entitlements.hasActiveMembership ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                }`}>
                  {entitlements.hasActiveMembership ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Tickets card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:bg-stone-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">{t.tickets}</h3>
                <p className="mt-2 text-lg font-bold text-stone-900">
                  {entitlements.eventTickets.filter((t) => ["confirmed", "checked_in"].includes(t.status)).length}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {locale === "bg" ? "активни билета" : "active tickets"}
                </p>
              </div>

              {/* Products card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:bg-stone-800">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">{t.products}</h3>
                <p className="mt-2 text-lg font-bold text-stone-900">
                  {entitlements.products.length}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {locale === "bg" ? "закупени" : "purchased"}
                </p>
              </div>

              {/* Inner circle CTA */}
              {entitlements.hasActiveMembership ? (
                <div className="sm:col-span-3">
                  <Link
                    href="/inner-circle"
                    className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 p-5 transition-colors hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-50/20 dark:hover:bg-amber-50/30"
                  >
                    <div>
                      <h3 className="font-bold text-stone-900">{t.innerCircle}</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {locale === "bg"
                          ? "Достъп до уроци, сесии и ритуали за твоето ниво."
                          : "Access lessons, sessions, and rituals for your tier."}
                      </p>
                    </div>
                    <span className="text-amber-700">→</span>
                  </Link>
                </div>
              ) : (
                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 dark:bg-stone-800">
                    <div>
                      <h3 className="font-bold text-stone-900">
                        {locale === "bg" ? "Присъедини се към вътрешния кръг" : "Join the Inner Circle"}
                      </h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {locale === "bg"
                          ? "Избери своя път и получи достъп до ексклузивно съдържание."
                          : "Choose your path and access exclusive content."}
                      </p>
                    </div>
                    <Link
                      href="/membership"
                      className="rounded-full px-4 py-2 text-xs font-bold"
                      style={{ backgroundColor: "#fbbf24", color: "#000000" }}
                    >
                      {t.becomeMember}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Memberships */}
          {tab === "memberships" && (
            entitlements.memberships.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-stone-400">{t.noMemberships}</p>
                <Link
                  href="/membership"
                  className="mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-bold"
                  style={{ backgroundColor: "#fbbf24", color: "#000000" }}
                >
                  {t.becomeMember}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {entitlements.memberships.map((m, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-white p-4 dark:bg-stone-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-900">{m.tierName}</p>
                        {m.currentPeriodEnd && (
                          <p className="mt-1 text-xs text-stone-500">
                            {t.nextBilling}:{" "}
                            {new Date(m.currentPeriodEnd).toLocaleDateString(
                              locale === "bg" ? "bg-BG" : "en-US",
                            )}
                          </p>
                        )}
                        {m.cancelAtPeriodEnd && (
                          <p className="mt-1 text-xs text-rose-500">
                            {locale === "bg" ? "Ще бъде отменен в края на периода" : "Cancels at period end"}
                          </p>
                        )}
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[m.status] || "bg-stone-100 text-stone-500"}`}>
                        {m.status}
                      </span>
                    </div>
                    <Link
                      href="/membership"
                      className="mt-3 inline-block text-xs text-amber-600 hover:text-amber-700"
                    >
                      {t.manage} →
                    </Link>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Tickets */}
          {tab === "tickets" && (
            entitlements.eventTickets.length === 0 ? (
              <p className="py-12 text-center text-sm text-stone-400">{t.noTickets}</p>
            ) : (
              <div className="space-y-3">
                {entitlements.eventTickets.map((t, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-white p-4 dark:bg-stone-800">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stone-900">{t.eventTitle}</p>
                        {t.eventStartsAt && (
                          <p className="mt-1 text-xs text-stone-500">
                            {new Date(t.eventStartsAt).toLocaleDateString(
                              locale === "bg" ? "bg-BG" : "en-US",
                              { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        )}
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[t.status] || "bg-stone-100 text-stone-500"}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Products */}
          {tab === "products" && (
            entitlements.products.length === 0 ? (
              <p className="py-12 text-center text-sm text-stone-400">{t.noProducts}</p>
            ) : (
              <div className="space-y-3">
                {entitlements.products.map((p, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-white p-4 dark:bg-stone-800">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-medium text-stone-900">{p.productName}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.fulfilled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.fulfilled
                          ? (locale === "bg" ? "Изпълнен" : "Fulfilled")
                          : (locale === "bg" ? "В процес" : "Processing")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
