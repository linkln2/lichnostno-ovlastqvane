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
  spotsLeft: number | null;
  isSoldOut: boolean;
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [waitlistError, setWaitlistError] = useState("");

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

  async function handleJoinWaitlist(pkg: Package) {
    setSelectedPkg(pkg);
    setShowWaitlistModal(true);
    setWaitlistStatus("idle");
    setWaitlistError("");
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPkg || !event) return;

    setWaitlistStatus("loading");
    setWaitlistError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          eventSlug: event.slug,
          package: selectedPkg.name,
          status: "waitlisted",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setWaitlistStatus("error");
        setWaitlistError(data.error || "Failed to join waitlist");
        return;
      }

      setWaitlistStatus("success");
    } catch {
      setWaitlistStatus("error");
      setWaitlistError("Network error");
    }
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
    joinWaitlist: locale === "bg" ? "Запиши се в списъка" : "Join waitlist",
    spotsLeft: locale === "bg" ? "свободни места" : "spots left",
    emailLabel: locale === "bg" ? "Имейл" : "Email",
    nameLabel: locale === "bg" ? "Име" : "Name",
    phoneLabel: locale === "bg" ? "Телефон" : "Phone",
    continue: locale === "bg" ? "Продължи" : "Continue",
    cancel: locale === "bg" ? "Отказ" : "Cancel",
    enterEmail: locale === "bg" ? "Въведи имейл за билет" : "Enter your email to buy tickets",
    noTickets: locale === "bg" ? "Все още няма билети за това събитие." : "No tickets available for this event yet.",
    spots: locale === "bg" ? "места" : "spots",
    waitlistTitle: locale === "bg" ? "Запиши се в списъка за чакащи" : "Join the waitlist",
    waitlistBody: locale === "bg" ? "Ще те уведомим, ако се освободи място." : "We'll notify you if a spot opens up.",
    waitlistSuccess: locale === "bg" ? "Записан си в списъка! Ще се свържем с теб." : "You're on the waitlist! We'll contact you.",
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
              const soldOut = pkg.isSoldOut;
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
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        {pkg.capacity > 0 && (
                          <span className={soldOut ? "text-rose-500" : "text-stone-400"}>
                            {soldOut
                              ? t.soldOut
                              : `${pkg.spotsLeft} ${t.spotsLeft}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-700">
                        {fmtPrice(pkg.priceCents)}
                      </p>
                    </div>
                  </div>

                  {soldOut ? (
                    <button
                      onClick={() => handleJoinWaitlist(pkg)}
                      className="mt-4 w-full rounded-full border-2 border-amber-600 px-5 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50"
                    >
                      {t.joinWaitlist} →
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(pkg)}
                      disabled={noStripe}
                      className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        noStripe
                          ? "bg-stone-200 text-stone-500"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      {noStripe ? t.comingSoon : `${t.buy} → ${fmtPrice(pkg.priceCents)}`}
                    </button>
                  )}
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

      {/* Waitlist modal */}
      {showWaitlistModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setShowWaitlistModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-stone-200 bg-white p-6 shadow-xl sm:rounded-2xl">
            {waitlistStatus === "success" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-600">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-stone-900">{t.waitlistSuccess}</h2>
                <button
                  onClick={() => setShowWaitlistModal(false)}
                  className="mt-6 rounded-full bg-stone-800 px-6 py-2.5 text-sm font-semibold text-white"
                >
                  {t.cancel}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-stone-900">{t.waitlistTitle}</h2>
                <p className="mt-1 text-sm text-stone-500">{t.waitlistBody}</p>
                <p className="mt-2 text-sm font-medium text-stone-700">
                  {selectedPkg.name} · {fmtPrice(selectedPkg.priceCents)}
                </p>
                <form onSubmit={handleWaitlistSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {t.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      autoComplete="name"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      placeholder={locale === "bg" ? "Твоето име" : "Your name"}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      inputMode="email"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="+359..."
                    />
                  </div>

                  {waitlistStatus === "error" && (
                    <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
                      {waitlistError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWaitlistModal(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={waitlistStatus === "loading"}
                      className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
                    >
                      {waitlistStatus === "loading"
                        ? locale === "bg" ? "Записване…" : "Saving…"
                        : t.joinWaitlist}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
