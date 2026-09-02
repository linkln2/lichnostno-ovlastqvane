"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalized } from "@/lib/i18n";
import { membershipTiers, site } from "@/lib/content";
import type { Tier } from "@/lib/api";

export default function MembershipPage({ tiers }: { tiers: Tier[] }) {
  const { locale } = useLocale();
  const [error] = useState<string | null>(null);

  // Checkout state
  const [checkoutTierId, setCheckoutTierId] = useState<number | string | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "error">("idle");
  const [loginError, setLoginError] = useState("");

  const t = {
    title: locale === "bg" ? "Членство" : "Membership",
    subtitle:
      locale === "bg"
        ? "Избери пътя, който звездите са прокарали пред теб."
        : "Choose the path the stars have laid before you.",
    perMonth: locale === "bg" ? "/ месец" : "/ month",
    perYear: locale === "bg" ? "/ година" : "/ year",
    subscribe: locale === "bg" ? "Абонирай се" : "Subscribe",
    mostPopular: locale === "bg" ? "Най-популярен" : "Most popular",
    noTiers:
      locale === "bg"
        ? "Все още няма планове за членство. Очаквайте скоро!"
        : "No membership plans available yet. Check back soon!",
    enterEmail: locale === "bg" ? "Въведи имейл за абонамент" : "Enter your email to subscribe",
    continue: locale === "bg" ? "Продължи" : "Continue",
    cancel: locale === "bg" ? "Отказ" : "Cancel",
    // Login
    memberLogin: locale === "bg" ? "Вече си член? Вход" : "Already a member? Log in",
    email: locale === "bg" ? "Имейл" : "Email",
    password: locale === "bg" ? "Парола" : "Password",
    loading: locale === "bg" ? "Изчакайте…" : "Loading…",
  };

  const tierIconMap: Record<number, string> = {};
  const staticByPrice: Record<number, (typeof membershipTiers)[number]> = {};
  for (const tier of membershipTiers) {
    if (tier.icon) tierIconMap[tier.price * 100] = tier.icon;
    staticByPrice[tier.price * 100] = tier;
  }

  function fmtPrice(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  async function handleSubscribe(tierId: number | string) {
    setCheckoutTierId(tierId);
    setShowEmailModal(true);
    setCheckoutStatus("idle");
    setCheckoutError("");
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutEmail || !checkoutTierId) return;
    setCheckoutStatus("loading");
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "subscription", tierId: checkoutTierId, customerEmail: checkoutEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutStatus("error");
        setCheckoutError(data.error || "Checkout failed");
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutStatus("error");
      setCheckoutError("Network error");
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginStatus("loading");
    setLoginError("");

    try {
      // Try staff first, then customer
      const staffRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (staffRes.ok) {
        window.location.href = "/dashboard";
        return;
      }

      const custRes = await fetch("/api/auth/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (custRes.ok) {
        window.location.href = "/account";
        return;
      }

      const custData = await custRes.json().catch(() => ({}));
      setLoginStatus("error");
      setLoginError(custData.error || (locale === "bg" ? "Невалидни данни" : "Invalid credentials"));
    } catch {
      setLoginStatus("error");
      setLoginError("Network error");
    }
  }

  return (
    <>
      {/* Hero + Login — two columns on desktop */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-12 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 md:flex-row md:items-stretch md:justify-between md:gap-12">
          {/* Title — left */}
          <div className="w-full text-center md:max-w-xl md:text-left">
            <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-50 px-6 py-6 shadow-sm dark:border-amber-500/40 dark:bg-amber-50/20 sm:px-8 sm:py-8 md:flex md:h-full md:flex-col md:justify-center">
              <h1 className="text-4xl font-black uppercase tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                {t.title}
              </h1>
              <p className="mt-4 text-lg text-stone-600">{t.subtitle}</p>
            </div>
          </div>

          {/* Login box — right */}
          <div className="w-full max-w-sm">
            <p className="mb-3 text-center text-sm font-semibold text-stone-700 md:text-left">{t.memberLogin}</p>
            <form
              onSubmit={handleLoginSubmit}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">{t.email}</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">{t.password}</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 pr-10 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-600"
                    aria-label={showLoginPassword ? "Hide" : "Show"}
                  >
                    {showLoginPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.87 13.87 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <path d="M2 2l20 20" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {loginStatus === "error" && (
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginStatus === "loading"}
                className="w-full rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
              >
                {loginStatus === "loading" ? t.loading : t.continue}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 sm:pt-5">
        {error ? (
          <p className="text-center text-stone-500">{error}</p>
        ) : tiers.length === 0 ? (
          <p className="py-20 text-center text-lg text-stone-500">{t.noTiers}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier, idx) => {
              const meta = staticByPrice[tier.priceCents];
              const isPopular = meta?.mostPopular ?? idx === 1;
              const displayName = meta ? getLocalized(meta.name, locale) : tier.name;
              const icon = meta?.icon ?? tierIconMap[tier.priceCents];
              const perks = meta ? meta.perks.map((p) => getLocalized(p, locale)) : tier.perks;
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7 ${
                    isPopular ? "border-amber-500 ring-2 ring-amber-500/20" : "border-stone-200"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      {t.mostPopular}
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    {icon && (
                      <img src={icon} alt={displayName} className="h-16 w-16 shrink-0 object-contain" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-stone-900">{displayName}</h3>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-stone-900">{fmtPrice(tier.priceCents)}</span>
                        <span className="text-sm text-stone-500">
                          {tier.interval === "month" ? t.perMonth : t.perYear}
                        </span>
                      </div>
                    </div>
                  </div>
                  {perks.length > 0 && (
                    <ul className="mt-5 flex-1 space-y-3">
                      {perks.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={!tier.stripePriceId}
                    className={`mt-8 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      isPopular ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-stone-800 text-white hover:bg-stone-900"
                    }`}
                  >
                    {!tier.stripePriceId
                      ? locale === "bg" ? "Очаквайте скоро" : "Coming soon"
                      : t.subscribe}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Email modal for checkout */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowEmailModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">{t.enterEmail}</h2>
            <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {locale === "bg" ? "Имейл" : "Email"}
                </label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="you@example.com"
                />
              </div>
              {checkoutStatus === "error" && (
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{checkoutError}</p>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={checkoutStatus === "loading"}
                  className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
                >
                  {checkoutStatus === "loading"
                    ? locale === "bg" ? "Отваряне…" : "Opening…"
                    : t.continue}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
