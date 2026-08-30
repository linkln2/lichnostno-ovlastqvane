"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { membershipTiers, site } from "@/lib/content";

type Tier = {
  id: number;
  name: string;
  priceCents: number;
  interval: "month" | "year";
  stripePriceId: string;
  perks: { perk: string }[];
};

export default function MembershipPage() {
  const { locale } = useLocale();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Portal form state
  const [portalEmail, setPortalEmail] = useState("");
  const [portalStatus, setPortalStatus] = useState<
    "idle" | "loading" | "error" | "redirecting"
  >("idle");
  const [portalError, setPortalError] = useState("");

  // Checkout state
  const [checkoutTierId, setCheckoutTierId] = useState<number | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

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
    choosePlan: locale === "bg" ? "Избери план" : "Choose a plan",
    noTiers:
      locale === "bg"
        ? "Все още няма планове за членство. Очаквайте скоро!"
        : "No membership plans available yet. Check back soon!",
    manageTitle:
      locale === "bg" ? "Управление на членството" : "Manage your membership",
    manageBody:
      locale === "bg"
        ? "Въведи имейла си, за да достъпиш биллинг портала на Stripe, където можеш да промениш плана си, актуализираш карта или отмените абонамента."
        : "Enter your email to access the Stripe billing portal, where you can change your plan, update your card, or cancel your subscription.",
    emailLabel: locale === "bg" ? "Имейл" : "Email",
    manageBtn: locale === "bg" ? "Отвори портала" : "Open portal",
    enterEmail:
      locale === "bg" ? "Въведи имейл за абонамент" : "Enter your email to subscribe",
    continue: locale === "bg" ? "Продължи" : "Continue",
    cancel: locale === "bg" ? "Отказ" : "Cancel",
    back: locale === "bg" ? "Обратно към сайта" : "Back to site",
  };

  const tierIconMap: Record<number, string> = {};
  const staticByPrice: Record<number, (typeof membershipTiers)[number]> = {};
  for (const tier of membershipTiers) {
    if (tier.icon) {
      tierIconMap[tier.price * 100] = tier.icon;
    }
    staticByPrice[tier.price * 100] = tier;
  }

  useEffect(() => {
    fetch("/api/subscription-tiers")
      .then((r) => r.json())
      .then((d) => {
        if (d.docs) setTiers(d.docs);
        else if (d.errors) setError("Failed to load tiers");
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  function fmtPrice(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  async function handleSubscribe(tierId: number) {
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
        body: JSON.stringify({
          mode: "subscription",
          tierId: checkoutTierId,
          customerEmail: checkoutEmail,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCheckoutStatus("error");
        setCheckoutError(data.error || "Checkout failed");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setCheckoutStatus("error");
      setCheckoutError("Network error");
    }
  }

  async function handlePortalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPortalStatus("loading");
    setPortalError("");

    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: portalEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPortalStatus("error");
        setPortalError(
          data.error ||
            (locale === "bg"
              ? "Не е намерен активен абонамент за този имейл."
              : "No active subscription found for that email.")
        );
        return;
      }

      setPortalStatus("redirecting");
      window.location.href = data.url;
    } catch {
      setPortalStatus("error");
      setPortalError("Network error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 text-lg text-stone-600">{t.subtitle}</p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg
              className="h-8 w-8 animate-spin text-amber-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.2"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : error ? (
          <p className="text-center text-stone-500">{error}</p>
        ) : tiers.length === 0 ? (
          <p className="py-20 text-center text-lg text-stone-500">{t.noTiers}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier, idx) => {
              const meta = staticByPrice[tier.priceCents];
              const isPopular = meta?.mostPopular ?? idx === 1;
              const displayName = meta ? meta.name[locale] : tier.name;
              const icon = meta?.icon ?? tierIconMap[tier.priceCents];
              const perks = meta
                ? meta.perks.map((p) => p[locale])
                : tier.perks.map((p) => p.perk);
              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7 ${
                    isPopular
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-stone-200"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                      {t.mostPopular}
                    </span>
                  )}

                  {/* Icon left, text right */}
                  <div className="flex items-center gap-4">
                    {icon && (
                      <img
                        src={icon}
                        alt={displayName}
                        className="h-16 w-16 shrink-0 object-contain"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-stone-900">
                        {displayName}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-stone-900">
                          {fmtPrice(tier.priceCents)}
                        </span>
                        <span className="text-sm text-stone-500">
                          {tier.interval === "month" ? t.perMonth : t.perYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Perks */}
                  {perks.length > 0 && (
                    <ul className="mt-5 flex-1 space-y-3">
                      {perks.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-stone-600"
                        >
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M20 6L9 17l-5-5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
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
                      isPopular
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-stone-800 text-white hover:bg-stone-900"
                    }`}
                  >
                    {!tier.stripePriceId
                      ? locale === "bg"
                        ? "Очаквайте скоро"
                        : "Coming soon"
                      : t.subscribe}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Manage membership */}
      <section className="bg-stone-100 py-16 sm:py-20">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900">
              {t.manageTitle}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{t.manageBody}</p>

            <form onSubmit={handlePortalSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={portalEmail}
                  onChange={(e) => setPortalEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="you@example.com"
                />
              </div>

              {portalStatus === "error" && (
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
                  {portalError}
                </p>
              )}

              <button
                type="submit"
                disabled={portalStatus === "loading" || portalStatus === "redirecting"}
                className="w-full rounded-full bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-900 disabled:opacity-60"
              >
                {portalStatus === "loading"
                  ? locale === "bg"
                    ? "Отваряне…"
                    : "Opening…"
                  : portalStatus === "redirecting"
                    ? locale === "bg"
                      ? "Пренасочване…"
                      : "Redirecting…"
                    : t.manageBtn}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Email modal for checkout */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-xl">
            <h2 className="text-lg font-bold text-stone-900">
              {t.enterEmail}
            </h2>
            <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t.emailLabel}
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
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
                  {checkoutError}
                </p>
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
                    ? locale === "bg"
                      ? "Отваряне…"
                      : "Opening…"
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
