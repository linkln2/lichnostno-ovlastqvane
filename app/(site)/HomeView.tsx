"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import CountdownTimer from "@/components/CountdownTimer";
import { generate } from "useinkjet";
import { ParticleBurst } from "@/components/ParticleBurst";
import { SolarSystemOrbits } from "@/components/SolarSystemOrbits";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { tr } from "@/lib/i18n";
import {
  hero,
  mission,
  values,
  testimonials,
  site,
  launchDate,
  formatDateRange,
  products,
  productCategories,
  membershipTiers,
  type ProductCategory,
  type EventItem,
  type BlogPost,
} from "@/lib/content";
import type { HomepageContent } from "@/lib/api";

// Video items come from /videos/manifest.json (fetched at runtime)
type VideoItem = {
  id: string;
  platform: "tiktok" | "facebook";
  src?: string;
  poster?: string;
  caption: { bg: string; en: string };
  date: string;
};

function VideoCard({ video }: { video: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25, rootMargin: "120px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (visible) el.play().catch(() => {});
    else el.pause();
  }, [visible]);

  if (!video.src) return null;

  return (
    <div
      ref={cardRef}
      className="w-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 shadow-sm sm:w-80"
      style={{ aspectRatio: "9/16" }}
    >
      <video
        ref={videoRef}
        src={visible ? video.src : undefined}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

const valueIcons = [
  /* Responsibility — shield with check (taking charge, accountability) */
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
  /* Awareness — eye (seeing, perception) */
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
  /* Authenticity — diamond/gem (true self, inner value) */
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg>,
  /* Community — users (togetherness, support) */
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
];

const ankhPattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M50 12 C30 12 18 24 18 40 C18 52 28 60 40 62 L40 92 L60 92 L60 62 C72 60 82 52 82 40 C82 24 70 12 50 12 Z" /><path d="M50 62 L50 92" stroke-width="5" /><path d="M25 78 L75 78" stroke-width="5" /></svg>`;

const merkabaPattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 8 L88 78 L12 78 Z" /><path d="M50 92 L88 22 L12 22 Z" /><circle cx="50" cy="50" r="28" stroke-width="1.5" opacity="0.4" /></svg>`;

export default function HomePage({
  homepageContent,
  events,
  blogPosts,
}: {
  homepageContent: HomepageContent;
  events: EventItem[];
  blogPosts: BlogPost[];
}) {
  const { locale } = useLocale();
  const [videoTab, setVideoTab] = useState<"all" | "tiktok" | "facebook">("all");
  const [productTab, setProductTab] = useState<"all" | ProductCategory>("all");
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState<{ event: any; pkg: any } | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketEmail, setTicketEmail] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);

  // ─── CMS-driven homepage content ──────────────────────────────
  // Passed from the server component (page.tsx) via getHomepageContent().
  // Falls back to static content in lib/content.ts when the database is
  // unreachable or the global hasn't been saved yet.
  const cms = homepageContent;

  // Merge CMS data over static content — CMS wins when present
  const heroContent = cms?.hero
    ? {
        title: cms.hero.title?.bg || cms.hero.title?.en || hero.title.bg
          ? { bg: cms.hero.title?.bg || hero.title.bg, en: cms.hero.title?.en || hero.title.en }
          : hero.title,
        subtitle: cms.hero.subtitle?.bg || cms.hero.subtitle?.en
          ? { bg: cms.hero.subtitle?.bg || hero.subtitle.bg, en: cms.hero.subtitle?.en || hero.subtitle.en }
          : hero.subtitle,
        primaryCtaText: cms.hero.primaryCtaText?.bg
          ? { bg: cms.hero.primaryCtaText.bg, en: cms.hero.primaryCtaText.en || cms.hero.primaryCtaText.bg }
          : { bg: "Разгледай", en: "Explore" },
        primaryCtaHref: cms.hero.primaryCtaHref || "/shop",
        secondaryCtaText: cms.hero.secondaryCtaText?.bg
          ? { bg: cms.hero.secondaryCtaText.bg, en: cms.hero.secondaryCtaText.en || cms.hero.secondaryCtaText.bg }
          : { bg: "Научи повече", en: "Learn more" },
        secondaryCtaHref: cms.hero.secondaryCtaHref || "/about",
        showCountdown: cms.hero.showCountdown ?? true,
        showVideoFeed: cms.hero.showVideoFeed ?? true,
      }
    : {
        title: hero.title,
        subtitle: hero.subtitle,
        primaryCtaText: { bg: "Разгледай", en: "Explore" },
        primaryCtaHref: "/shop",
        secondaryCtaText: { bg: "Научи повече", en: "Learn more" },
        secondaryCtaHref: "/about",
        showCountdown: true,
        showVideoFeed: true,
      };

  const missionContent: { bg: string; en: string } = cms?.mission?.text?.bg || cms?.mission?.text?.en
    ? { bg: cms.mission.text.bg || mission.bg, en: cms.mission.text.en || mission.en }
    : mission;

  const valuesContent: { title: { bg: string; en: string }; desc: { bg: string; en: string } }[] =
    cms?.values?.cards?.length > 0
      ? cms.values.cards.map((c: any) => ({
          title: { bg: c.title?.bg || c.title?.en || "", en: c.title?.en || c.title?.bg || "" },
          desc: { bg: c.description?.bg || c.description?.en || "", en: c.description?.en || c.description?.bg || "" },
        }))
      : values;

  const sectionsEnabled = {
    mission: cms?.mission?.enabled ?? true,
    values: cms?.values?.enabled ?? true,
    products: cms?.productsSection?.enabled ?? true,
    membership: cms?.membershipSection?.enabled ?? true,
    testimonials: cms?.testimonialsSection?.enabled ?? true,
    video: cms?.videoSection?.enabled ?? true,
    blog: cms?.blogSection?.enabled ?? true,
  };

  const [aztecPattern, setAztecPattern] = useState<string | null>(null);
  const [flowerPattern, setFlowerPattern] = useState<string | null>(null);
  useEffect(() => {
    const { svg: aztecSvg } = generate({
      pattern: "aztec",
      color: "#f59e0b",
      background: "none",
      scale: 1.6,
      seed: 7,
    });
    const { svg: flowerSvg } = generate({
      pattern: "flower-of-life",
      color: "#f59e0b",
      background: "none",
      scale: 1.4,
      seed: 11,
    });
    setAztecPattern(aztecSvg);
    setFlowerPattern(flowerSvg);
  }, []);

  const upcoming = events.filter((e) => e.status === "upcoming");
  const nextEvent = upcoming[0];

  useEffect(() => {
    fetch("/videos/manifest.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    if (!ticketOpen || !nextEvent) {
      setTicketData(null);
      return;
    }
    setTicketLoading(true);
    setBuyError(null);
    fetch(`/api/events/${nextEvent.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.packages?.length) {
          setTicketData({
            event: data,
            pkg: {
              id: "demo",
              name: locale === "bg" ? "Демо билет" : "Demo ticket",
              priceCents: 12500,
              isDemo: true,
            },
          });
          return;
        }
        const pkg =
          data.packages.find((p: any) => p.priceCents === 12500) ||
          data.packages[0];
        setTicketData({ event: data, pkg });
      })
      .catch(() => setTicketData(null))
      .finally(() => setTicketLoading(false));
  }, [ticketOpen, nextEvent]);

  const filteredVideos =
    videos && videoTab !== "all" ? videos.filter((v) => v.platform === videoTab) : (videos ?? []);
  const filteredProducts =
    productTab === "all" ? products : products.filter((p) => p.category === productTab);
  // Derive video tabs from the actual loaded data — only show platforms that have videos
  const videoTabs = (() => {
    if (!videos || videos.length === 0) return ["all"] as const;
    const platforms = Array.from(new Set(videos.map((v) => v.platform))).filter(
      (p) => p === "tiktok" || p === "facebook",
    );
    return ["all", ...platforms] as const;
  })();

  async function handleBuyTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketData?.pkg) return;
    if (ticketData.pkg.isDemo) {
      setBuyError(locale === "bg" ? "Демо режим — плащането е изключено." : "Demo mode — payment is disabled.");
      return;
    }
    setBuyLoading(true);
    setBuyError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventPackageId: ticketData.pkg.id,
          customerEmail: ticketEmail,
          mode: "payment",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBuyError(data.error || "Checkout failed");
      } else {
        window.location.href = data.url;
      }
    } catch (err) {
      setBuyError("Network error");
    } finally {
      setBuyLoading(false);
    }
  }

  function ticketPriceCents() {
    return 12500;
  }

  return (
    <>
      {/* Dark space background + starfield — fixed, behind all content */}
      <div className="fixed inset-0 z-0 bg-[#0a0a14]" />
      <StarfieldBackground className="z-0 opacity-70" />

      <div className="relative z-10">
      {/* Hero + countdown to next event */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-stone-50 dark:bg-gradient-to-b dark:from-amber-50/10 dark:to-stone-900/80">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #292524 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 dark:bg-transparent sm:px-6 sm:py-28">
          {/* Top row: logo left, title + text right */}
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
            <div className="shrink-0">
              <img
                src="/logo.webp"
                alt={locale === "bg" ? "Личностно овластяване — лого" : "Personal Empowerment — logo"}
                className="h-44 w-44 rounded-full object-cover shadow-xl dark:hidden lg:h-56 lg:w-56"
              />
              <img
                src="/pictures/dark-mode-logo.webp"
                alt={locale === "bg" ? "Личностно овластяване — лого" : "Personal Empowerment — logo"}
                className="hidden h-44 w-44 rounded-full object-cover shadow-xl dark:block lg:h-56 lg:w-56"
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block rounded-full border border-amber-200 bg-amber-100 px-4 py-1 text-xs font-medium text-amber-800 dark:border-amber-200/30 dark:bg-amber-100/20">
                {tr("hero_badge", locale)}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                {heroContent.title[locale]}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone-600">
                {heroContent.subtitle[locale]}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Countdown with buy ticket */}
      {heroContent.showCountdown && (
      <section className="bg-stone-100 py-8 dark:bg-stone-900/80 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-lg font-bold text-stone-800 sm:text-xl">
            {locale === "bg" ? "Голямото събитие идва скоро" : "The big event is coming soon"}
          </h2>
          <p className="mt-1.5 text-xs text-stone-500 sm:text-sm">
            {locale === "bg" ? "Бъди сред първите, които ще го преживеят" : "Be among the first to experience it"}
          </p>
          <div className="mt-6">
            <CountdownTimer target={launchDate} />
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setTicketOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-center text-sm font-bold transition-all hover:shadow-lg sm:text-base"
              style={{ backgroundColor: "#fbbf24", color: "#000000" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
              </svg>
              {locale === "bg" ? "Купи билет" : "Buy ticket"}
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Video feed */}
      {sectionsEnabled.video && (
      <section className="bg-stone-50 py-16 dark:bg-stone-900/60 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("feed_title", locale)}
          </h2>
          <p className="mt-3 text-center text-stone-500">
            {tr("feed_subtitle", locale)}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {videoTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setVideoTab(tab)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  videoTab === tab
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab === "all" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                  </svg>
                ) : tab === "tiktok" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {tab === "all" ? tr("feed_all", locale) : tr(`feed_${tab}`, locale)}
              </button>
            ))}
          </div>

          <div className="relative mt-10">
            <button
              onClick={() => videoScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
              className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-600 shadow-md hover:text-stone-900 sm:-left-4"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => videoScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
              className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-600 shadow-md hover:text-stone-900 sm:-right-4"
              aria-label="Scroll right"
            >
              →
            </button>
            <div
              ref={videoScrollRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-8 pb-4 pt-1"
            >
              {filteredVideos.length > 0 ? (
                filteredVideos.map((v) => <VideoCard key={v.id} video={v} />)
              ) : (
                <p className="w-full text-center text-sm text-stone-500">
                  {tr("feed_empty", locale)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={site.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              {tr("feed_follow_tiktok", locale)} →
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              {locale === "bg" ? "Последвай ни във Facebook" : "Follow us on Facebook"} →
            </a>
          </div>
        </div>
      </section>
      )}

      {/* Shop */}
      {sectionsEnabled.products && (
      <section className="bg-white py-16 dark:bg-stone-900/70 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("section_shop_title", locale)}
          </h2>
          <p className="mt-3 text-center text-stone-500">
            {tr("section_shop_subtitle", locale)}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setProductTab("all")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                productTab === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tr("shop_all", locale)}
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setProductTab(cat.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  productTab === cat.key
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.label[locale]}
              </button>
            ))}
          </div>

          <div className="relative mt-10">
            <button
              onClick={() => productScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
              className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-stone-900/90 p-2 text-white shadow-md hover:bg-stone-900 sm:-left-4"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => productScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
              className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-stone-900/90 p-2 text-white shadow-md hover:bg-stone-900 sm:-right-4"
              aria-label="Scroll right"
            >
              →
            </button>
            <div
              ref={productScrollRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-8 pb-4 pt-1"
            >
              {filteredProducts.map((p) => (
                <div
                  key={p.slug}
                  className="w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm sm:w-72"
                >
                  <div className="relative h-44 bg-gradient-to-br from-amber-100 via-stone-50 to-stone-200">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name[locale]}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        {p.category === "bracelets" && "📿"}
                        {p.category === "crystals" && "💎"}
                        {p.category === "potions" && "🧪"}
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-stone-700">
                      {productCategories.find((c) => c.key === p.category)?.label[locale]}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900">{p.name[locale]}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                      {p.description[locale]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-amber-800">
                        €{p.price}
                      </span>
                      <button
                        disabled
                        className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white opacity-60"
                      >
                        {tr("shop_soon", locale)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Mission + Values — centered around holy.png with particles */}
      {sectionsEnabled.mission && sectionsEnabled.values && (
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-stone-50 py-20 dark:bg-gradient-to-b dark:from-amber-50/10 dark:to-stone-900/60 sm:py-28">
        {/* Particle burst effect */}
        <ParticleBurst />

        {/* Radial glow behind the image */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0) 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
              {locale === "bg" ? "Нашата мисия и ценности" : "Our mission & values"}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600">
              {missionContent[locale]}
            </p>
          </div>

          {/* Center image with values orbiting */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12">
            {/* Left values (2) — icon top-right */}
            <div className="flex flex-col gap-8 lg:gap-12">
              {valuesContent.slice(0, 2).map((v, i) => (
                <div
                  key={v.title.en}
                  className="flex flex-1 flex-col rounded-2xl border border-amber-200 bg-white p-6 transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-lg dark:border-amber-200/30 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <div className="mb-3 flex justify-end text-amber-700">{valueIcons[i]}</div>
                  <h4 className="text-lg font-semibold text-amber-800">{v.title[locale]}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{v.desc[locale]}</p>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Solar system orbits behind image */}
                <SolarSystemOrbits className="absolute inset-0 z-0 opacity-80" />
                {/* Glow */}
                <div className="absolute inset-0 -m-4 rounded-full bg-amber-300/20 blur-2xl" />
                <img
                  src="/pictures/holy.webp"
                  alt={locale === "bg" ? "Седем дни на творението и четирите велики посвещения" : "The Seven Days of Creation and the Four Great Initiations"}
                  className="relative z-10 h-96 w-auto rounded-2xl object-cover shadow-2xl sm:h-[32rem] lg:h-[40rem]"
                />
              </div>
              {/* Image title */}
              <p className="mt-6 max-w-xs text-center text-xs font-medium uppercase tracking-wide text-amber-700/80">
                {locale === "bg"
                  ? "Седем дни на творението и четирите велики посвещения"
                  : "The Seven Days of Creation & the Four Great Initiations"}
              </p>
            </div>

            {/* Right values (2) — icon top-left */}
            <div className="flex flex-col gap-8 lg:gap-12">
              {valuesContent.slice(2, 4).map((v, i) => (
                <div
                  key={v.title.en}
                  className="flex flex-1 flex-col rounded-2xl border border-amber-200 bg-white p-6 transition-all hover:border-amber-300 hover:bg-amber-50 hover:shadow-lg dark:border-amber-200/30 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <div className="mb-3 flex justify-start text-amber-700">{valueIcons[i + 2]}</div>
                  <h4 className="text-lg font-semibold text-amber-800">{v.title[locale]}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{v.desc[locale]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: values below image in a grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden">
            {valuesContent.map((v, i) => (
              <div
                key={v.title.en}
                className="flex flex-col rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-200/30 dark:bg-white/10"
              >
                <div className={`mb-3 flex text-amber-700 ${i < 2 ? "justify-end" : "justify-start"}`}>
                  {valueIcons[i]}
                </div>
                <h4 className="text-lg font-semibold text-amber-800">{v.title[locale]}</h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{v.desc[locale]}</p>
              </div>
            ))}
          </div>

          {/* Symbolism explanation */}
          <div className="mx-auto mt-20 max-w-3xl space-y-6">
            <h3 className="text-center text-lg font-semibold text-stone-900">
              {locale === "bg" ? "Символизмът на кадуцея" : "The Symbolism of the Caduceus"}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Two serpents */}
              <div className="rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-200/30 dark:bg-white/10">
                <h4 className="text-sm font-semibold text-amber-800">
                  {locale === "bg" ? "Двете змии" : "The Two Serpents"}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {locale === "bg"
                    ? "Две противоположни сили — мъжко/женско, слънце/луна, дух/материя — се извиват около централната ос. Всяко пресичане е етап: опитност → конфликт → помирение → трансформация."
                    : "Two opposing forces — masculine/feminine, sun/moon, spirit/matter — wind around the central axis. Each crossing marks a stage: experience → conflict → reconciliation → transformation."}
                </p>
              </div>
              {/* Central staff */}
              <div className="rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-200/30 dark:bg-white/10">
                <h4 className="text-sm font-semibold text-amber-800">
                  {locale === "bg" ? "Централният жезъл" : "The Central Staff"}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {locale === "bg"
                    ? "Жезълът е оста на възхода — пътят от заземената материя към разширено осъзнаване."
                    : "The staff is the axis of ascent — the path from grounded matter toward expanded awareness."}
                </p>
              </div>
              {/* Seven stages */}
              <div className="rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-200/30 dark:bg-white/10">
                <h4 className="text-sm font-semibold text-amber-800">
                  {locale === "bg" ? "Седемте планетарни етапа" : "The Seven Planetary Stages"}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {locale === "bg"
                    ? "Седем нива на посвещение, свързани с класическите планети: Меркурий (трансформация), Марс (действие), Луна (интуиция), Венера (привличане), Сатурн (ограничение), Слънце (озарение), Юпитер (разширение)."
                    : "Seven levels of initiation linked to the classical planets: Mercury (transformation), Mars (action), Moon (intuition), Venus (attraction), Saturn (limitation), Sun (illumination), Jupiter (expansion)."}
                </p>
              </div>
              {/* The ascent */}
              <div className="rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-200/30 dark:bg-white/10">
                <h4 className="text-sm font-semibold text-amber-800">
                  {locale === "bg" ? "Възходът" : "The Ascent"}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {locale === "bg"
                    ? "От материята, през планетарните етапи, към интеграция на противоположностите — където символът се отваря в криле и изкачването става полет."
                    : "From matter, through the planetary stages, toward the integration of opposites — where the symbol opens outward into wings, and the climb becomes flight."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials preview */}
      {sectionsEnabled.testimonials && (
      <section className="bg-white py-16 dark:bg-stone-900/70 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("section_testimonials_title", locale)}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <blockquote className="text-sm leading-relaxed text-stone-700">
                  &ldquo;{t.text[locale]}&rdquo;
                </blockquote>
                <figcaption className="mt-4">
                  <div className="font-semibold text-stone-900">{t.name}</div>
                  <div className="text-xs text-stone-500">{t.role[locale]}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/testimonials"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              {tr("btn_all_testimonials", locale)} →
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Membership tiers */}
      {sectionsEnabled.membership && (
      <section className="bg-stone-50 py-16 dark:bg-stone-900/60 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {locale === "bg" ? "Членство" : "Membership"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600">
            {locale === "bg"
              ? "Избери пътя, който звездите са прокарали пред теб."
              : "Choose the path the stars have laid before you."}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name.en}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-7 ${
                  tier.mostPopular
                    ? "border-amber-500 ring-2 ring-amber-500/20"
                    : "border-stone-200"
                }`}
              >
                {tier.mostPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                    {locale === "bg" ? "Най-популярен" : "Most popular"}
                  </span>
                )}

                {/* Icon left, text right */}
                <div className="flex items-center gap-4">
                  <img
                    src={tier.icon}
                    alt={tier.name[locale]}
                    className="h-16 w-16 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-stone-900">
                      {tier.name[locale]}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-stone-900">
                        €{tier.price}
                      </span>
                      <span className="text-sm text-stone-500">
                        / {locale === "bg" ? "месец" : "month"}
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {tier.perks.map((perk, i) => (
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
                      {perk[locale]}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/membership"
                  className={`mt-8 w-full rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                    tier.mostPopular
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-stone-800 text-white hover:bg-stone-900"
                  }`}
                >
                  {locale === "bg" ? "Виж повече" : "View plans"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Recent posts */}
      {sectionsEnabled.blog && (
      <section className="mx-auto max-w-6xl px-4 py-16 dark:bg-stone-900/70 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-amber-800 sm:text-3xl">
          {tr("section_recent_posts", locale)}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-amber-500 dark:hover:bg-stone-700"
            >
              {post.cover && (
                <div className="aspect-video w-full overflow-hidden bg-stone-100">
                  <img
                    src={post.cover}
                    alt={post.title[locale]}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <time className="text-xs text-stone-400">{post.date}</time>
                <h3 className="mt-2 font-semibold text-stone-900 group-hover:text-amber-800">
                  {post.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {post.excerpt[locale]}
                </p>
                <span className="mt-3 inline-block text-xs text-stone-400">
                  {post.readTime[locale]}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            {tr("btn_all_posts", locale)} →
          </Link>
        </div>
      </section>
      )}

      {/* Buy ticket modal */}
      {ticketOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setTicketOpen(false)}
        >
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setTicketOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-center text-2xl font-bold text-stone-900">
              {locale === "bg" ? "Запази своето място" : "Reserve your spot"}
            </h3>
            <p className="mt-2 text-center text-sm text-stone-500">
              {ticketData?.event?.title || (locale === "bg" ? "Голямото събитие" : "The big event")}
            </p>

            {ticketLoading ? (
              <p className="mt-6 text-center text-stone-500">{locale === "bg" ? "Зареждане…" : "Loading…"}</p>
            ) : !ticketData?.pkg ? (
              <p className="mt-6 text-center text-stone-500">
                {locale === "bg" ? "Все още няма активни билети." : "Tickets are not available yet."}
              </p>
            ) : (
              <form onSubmit={handleBuyTicket} className="mt-6 space-y-5">
                <div className="rounded-2xl bg-amber-50 p-4 text-center">
                  <p className="text-sm text-stone-600">{locale === "bg" ? "Избран билет" : "Selected ticket"}</p>
                  <p className="text-lg font-semibold text-stone-900">{ticketData.pkg.name}</p>
                  <p className="mt-1 text-3xl font-bold text-amber-700">
                    €{(ticketPriceCents() / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                {buyError && (
                  <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{buyError}</p>
                )}
                <button
                  type="submit"
                  disabled={buyLoading}
                  className="w-full rounded-full bg-amber-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50"
                >
                  {buyLoading
                    ? (locale === "bg" ? "Обработка…" : "Processing…")
                    : (locale === "bg" ? "Плати с карта" : "Pay by card")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
