"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";

type Package = {
  id: number;
  name: string;
  priceCents: number;
  priceDisplay: string;
  spots: string;
  stripePriceId: string;
  capacity: number;
};

type EventData = {
  id: number;
  title: string;
  slug: string;
  location: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  status: string;
  packages: Package[];
};

export default function EventDetailPage() {
  const { locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // Ticket selection state
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [email, setEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${params.slug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFoundFlag(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setEvent(d);
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (notFoundFlag) return notFound();
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="h-8 w-8 animate-spin text-amber-600" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (!event) return notFound();

  function fmtDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  function fmtPrice(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  async function handleBuy(pkg: Package) {
    setSelectedPkg(pkg);
    setShowEmailModal(true);
    setCheckoutStatus("idle");
    setCheckoutError("");
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPkg) return;

    setCheckoutStatus("loading");
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventPackageId: selectedPkg.id,
          customerEmail: email,
        }),
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

  const t = {
    back: tr("nav_events", locale),
    about: locale === "bg" ? "За събитието" : "About this event",
    tickets: locale === "bg" ? "Билети" : "Tickets",
    buy: locale === "bg" ? "Купи" : "Buy",
    soldOut: locale === "bg" ? "Изчерпани" : "Sold out",
    comingSoon: locale === "bg" ? "Очаквайте скоро" : "Coming soon",
    emailLabel: locale === "bg" ? "Имейл" : "Email",
    continue: locale === "bg" ? "Продължи" : "Continue",
    cancel: locale === "bg" ? "Отказ" : "Cancel",
    enterEmail: locale === "bg" ? "Въведи имейл за билет" : "Enter your email to buy tickets",
    noTickets: locale === "bg" ? "Все още няма билети за това събитие." : "No tickets available for this event yet.",
    spots: locale === "bg" ? "места" : "spots",
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-700 to-amber-900 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/events" className="text-sm text-amber-200 hover:text-amber-100">
            ← {t.back}
          </Link>
          <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl">
            {event.title}
          </h1>
          <div className="mt-3 flex flex-col gap-1 text-sm text-amber-100 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <span>📅 {fmtDate(event.startsAt)}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>
      </section>

      {/* Ticket tiers — mobile-first stacked cards */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <h2 className="text-xl font-bold text-stone-900">{t.tickets}</h2>

        {event.packages.length === 0 ? (
          <p className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-500">
            {t.noTickets}
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {event.packages.map((pkg, idx) => {
              const soldOut = pkg.capacity > 0 && pkg.capacity <= 0; // TODO: check registrations count
              const noStripe = !pkg.stripePriceId;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border p-5 shadow-sm transition-shadow sm:p-6 ${
                    idx === 1
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-stone-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-stone-900">{pkg.name}</h3>
                      {pkg.spots && (
                        <p className="mt-1 text-sm text-stone-600">{pkg.spots}</p>
                      )}
                      {pkg.capacity > 0 && (
                        <p className="mt-2 text-xs text-stone-400">
                          {pkg.capacity} {t.spots}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-700">
                        {fmtPrice(pkg.priceCents)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(pkg)}
                    disabled={soldOut || noStripe}
                    className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      soldOut
                        ? "bg-stone-200 text-stone-500"
                        : noStripe
                          ? "bg-stone-200 text-stone-500"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    {soldOut ? t.soldOut : noStripe ? t.comingSoon : `${t.buy} → ${fmtPrice(pkg.priceCents)}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Email modal for checkout */}
      {showEmailModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-stone-200 bg-white p-6 shadow-xl sm:rounded-2xl">
            <h2 className="text-lg font-bold text-stone-900">{t.enterEmail}</h2>
            <p className="mt-1 text-sm text-stone-500">
              {selectedPkg.name} · {fmtPrice(selectedPkg.priceCents)}
            </p>
            <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
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
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={checkoutStatus === "loading"}
                  className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
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
