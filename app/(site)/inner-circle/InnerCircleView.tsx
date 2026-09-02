"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { getLocalized } from "@/lib/i18n";
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

// Inner circle video content — YouTube unlisted embeds
// Replace these IDs with real unlisted YouTube video IDs
const innerCircleVideos = [
  {
    id: "ic-1",
    youtubeId: "dQw4w9WgXcQ", // placeholder — replace with real unlisted video
    title: { bg: "Посвещение на търсещите", en: "Initiation for Seekers" },
    description: {
      bg: "Първи урок от вътрешния кръг. Въведение в практиките.",
      en: "First lesson from the inner circle. Introduction to the practices.",
    },
    tier: "seeker",
    date: "2026-09-01",
  },
  {
    id: "ic-2",
    youtubeId: "dQw4w9WgXcQ",
    title: { bg: "Трансмутация на енергията", en: "Transmutation of Energy" },
    description: {
      bg: "Седмична сесия за алхимиците. Работа с вътрешната сила.",
      en: "Weekly session for Alchemists. Working with inner power.",
    },
    tier: "alchemist",
    date: "2026-09-08",
  },
  {
    id: "ic-3",
    youtubeId: "dQw4w9WgXcQ",
    title: { bg: "Гадене и виждане отвъд формата", en: "Scrying and Seeing Beyond Form" },
    description: {
      bg: "Напреднала сесия за адептите. Развитие на третото око.",
      en: "Advanced session for Adepts. Developing the third eye.",
    },
    tier: "adept",
    date: "2026-09-15",
  },
];

// Tier access levels (priceCents thresholds)
const TIER_ACCESS: Record<string, number> = {
  seeker: 900,      // €9
  alchemist: 1900,  // €19
  adept: 3900,      // €39
};

export default function InnerCirclePage() {
  const { locale } = useLocale();
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/entitlements")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/membership";
          return null;
        }
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        if (data) setEntitlements(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-stone-500">
          {locale === "bg" ? "Зареждане..." : "Loading..."}
        </div>
      </div>
    );
  }

  // Not a member — show upgrade prompt
  if (!entitlements || !entitlements.hasActiveMembership) {
    return (
      <div className="relative min-h-screen bg-stone-50 dark:bg-stone-900">
        <StarfieldBackground className="opacity-20" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="mb-6 text-6xl">🔒</div>
          <h1 className="text-3xl font-bold text-stone-900">
            {locale === "bg" ? "Вътрешният кръг е затворен" : "The Inner Circle is sealed"}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-stone-600">
            {locale === "bg"
              ? "Това съдържание е само за членове. Избери своя път и се присъедини към вътрешния кръг."
              : "This content is for members only. Choose your path and join the inner circle."}
          </p>
          <Link
            href="/membership"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:shadow-lg"
            style={{ backgroundColor: "#fbbf24", color: "#000000" }}
          >
            {locale === "bg" ? "Избери план" : "Choose a plan"}
          </Link>
        </div>
      </div>
    );
  }

  // Member — show content
  const userTierPrice = entitlements.highestTierPrice || 0;

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-900">
      <StarfieldBackground className="opacity-15" />

      <div className="relative z-10">
        {/* Header */}
        <section className="bg-gradient-to-b from-amber-50/90 to-stone-50/85 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                  {locale === "bg" ? "Вътрешен кръг" : "Inner Circle"}
                </h1>
                <p className="mt-2 text-stone-600">
                  {locale === "bg"
                    ? `Добре дошъл, ${entitlements.email}. Твоят ранг: ${entitlements.highestTierName}`
                    : `Welcome, ${entitlements.email}. Your rank: ${entitlements.highestTierName}`}
                </p>
              </div>
              <Link
                href="/account"
                className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100"
              >
                {locale === "bg" ? "Профил" : "Account"}
              </Link>
            </div>
          </div>
        </section>

        {/* Video feed */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-8 text-xl font-bold text-stone-900">
            {locale === "bg" ? "Уроци и сесии" : "Lessons & Sessions"}
          </h2>

          <div className="grid gap-8">
            {innerCircleVideos.map((video) => {
              const requiredPrice = TIER_ACCESS[video.tier] || 0;
              const hasAccess = userTierPrice >= requiredPrice;

              return (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:bg-stone-800"
                >
                  {/* Video player or lock */}
                  {hasAccess ? (
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                        title={getLocalized(video.title, locale)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-stone-900">
                      <div className="text-center">
                        <div className="mb-3 text-5xl">🔒</div>
                        <p className="text-sm text-stone-400">
                          {locale === "bg"
                            ? `Изисква ранг: ${video.tier}`
                            : `Requires rank: ${video.tier}`}
                        </p>
                        <Link
                          href="/membership"
                          className="mt-4 inline-block rounded-full px-4 py-2 text-xs font-bold"
                          style={{ backgroundColor: "#fbbf24", color: "#000000" }}
                        >
                          {locale === "bg" ? "Надгради" : "Upgrade"}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                        {video.tier}
                      </span>
                      <time className="text-xs text-stone-400">{video.date}</time>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-stone-900">
                      {getLocalized(video.title, locale)}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {getLocalized(video.description, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Entitlements summary */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:bg-stone-800">
            <h3 className="mb-4 font-bold text-stone-900">
              {locale === "bg" ? "Твоите права" : "Your entitlements"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Memberships */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {locale === "bg" ? "Членство" : "Membership"}
                </h4>
                {entitlements.memberships.length > 0 ? (
                  entitlements.memberships.map((m, i) => (
                    <div key={i} className="mt-2 text-sm text-stone-700">
                      <span className="font-semibold">{m.tierName}</span>
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        m.status === "active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-sm text-stone-400">—</p>
                )}
              </div>

              {/* Event tickets */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {locale === "bg" ? "Билети за събития" : "Event tickets"}
                </h4>
                {entitlements.eventTickets.length > 0 ? (
                  entitlements.eventTickets.map((t, i) => (
                    <div key={i} className="mt-2 text-sm text-stone-700">
                      {t.eventTitle}
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-sm text-stone-400">—</p>
                )}
              </div>

              {/* Products */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {locale === "bg" ? "Продукти" : "Products"}
                </h4>
                {entitlements.products.length > 0 ? (
                  entitlements.products.map((p, i) => (
                    <div key={i} className="mt-2 text-sm text-stone-700">
                      {p.productName}
                    </div>
                  ))
                ) : (
                  <p className="mt-2 text-sm text-stone-400">—</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
