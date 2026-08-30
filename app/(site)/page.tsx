"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import CountdownTimer from "@/components/CountdownTimer";
import { generate } from "useinkjet";
import { tr } from "@/lib/i18n";
import {
  hero,
  mission,
  values,
  events,
  testimonials,
  blogPosts,
  site,
  launchDate,
  formatDateRange,
  products,
  productCategories,
  membershipTiers,
  type ProductCategory,
  type VideoItem,
} from "@/lib/content";

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
        src={video.src}
        poster={video.poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

const valueIcons = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
];

const ankhPattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M50 12 C30 12 18 24 18 40 C18 52 28 60 40 62 L40 92 L60 92 L60 62 C72 60 82 52 82 40 C82 24 70 12 50 12 Z" /><path d="M50 62 L50 92" stroke-width="5" /><path d="M25 78 L75 78" stroke-width="5" /></svg>`;

const merkabaPattern = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 8 L88 78 L12 78 Z" /><path d="M50 92 L88 22 L12 22 Z" /><circle cx="50" cy="50" r="28" stroke-width="1.5" opacity="0.4" /></svg>`;

export default function HomePage() {
  const { locale } = useLocale();
  const [videoTab, setVideoTab] = useState<"all" | "tiktok" | "instagram">("all");
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
      {/* Hero + countdown to next event */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-stone-50 to-stone-50">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #292524 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          {/* Top row: logo left, title + text right */}
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
            <div className="shrink-0">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-amber-100 ring-4 ring-white/60 shadow-xl lg:h-48 lg:w-48">
                <img
                  src="/logo.png"
                  alt={locale === "bg" ? "Личностно овластяване — лого" : "Personal Empowerment — logo"}
                  className="h-36 w-36 rounded-full object-cover lg:h-44 lg:w-44"
                />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block rounded-full border border-amber-200 bg-amber-100/60 px-4 py-1 text-xs font-medium text-amber-800">
                {tr("hero_badge", locale)}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                {hero.title[locale]}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone-600">
                {hero.subtitle[locale]}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Countdown with buy ticket */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div
          className="pointer-events-none absolute -right-12 -top-12 z-0 w-56 h-56 opacity-20 -rotate-6 sm:w-80 sm:h-80 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: aztecPattern || "" }}
        />
        <div
          className="pointer-events-none absolute -left-8 -top-4 z-0 w-28 h-28 text-amber-400 opacity-20 sm:-left-12 sm:w-40 sm:h-40 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: ankhPattern }}
        />
        <div
          className="pointer-events-none absolute -left-8 bottom-0 z-0 w-40 h-40 opacity-15 rotate-12 sm:w-60 sm:h-60 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: flowerPattern || "" }}
        />
        <div
          className="pointer-events-none absolute -right-6 bottom-0 z-0 w-28 h-28 text-amber-400 opacity-20 sm:-right-10 sm:w-40 sm:h-40 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: merkabaPattern }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {locale === "bg" ? "Голямото събитие идва скоро" : "The big event is coming soon"}
          </h2>
          <p className="mt-3 text-center text-sm text-stone-300 sm:text-base">
            {locale === "bg" ? "Бъди сред първите, които ще го преживеят" : "Be among the first to experience it"}
          </p>
          <div className="mt-8">
            <CountdownTimer target={launchDate} />
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => setTicketOpen(true)}
              className="inline-block rounded-full bg-amber-500 px-8 py-3 text-center font-semibold text-stone-900 transition-colors hover:bg-amber-400"
            >
              {locale === "bg" ? "Купи билет" : "Buy ticket"} →
            </button>
          </div>
        </div>
      </section>

      {/* Video feed */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("feed_title", locale)}
          </h2>
          <p className="mt-3 text-center text-stone-500">
            {tr("feed_subtitle", locale)}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(["all", "tiktok", "instagram"] as const).map((tab) => (
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
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
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-pink-700 hover:text-pink-800"
            >
              {locale === "bg" ? "Последвай ни в Instagram" : "Follow us on Instagram"} →
            </a>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="bg-white py-16 sm:py-20">
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

      {/* Mission + Values */}
      <section className="bg-amber-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {locale === "bg" ? "Нашата мисия и ценности" : "Our mission & values"}
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Mission card */}
            <div className="flex flex-col justify-center rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16.2 7.8 12 12" />
                  <path d="m14 12-2 2" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="M17.66 17.66 19.07 19.07" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66 4.93 19.07" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900">
                {tr("section_mission_title", locale)}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                {mission[locale]}
              </p>
            </div>

            {/* Values grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <div
                  key={v.title.en}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    {valueIcons[i]}
                  </div>
                  <h4 className="font-semibold text-amber-800">{v.title[locale]}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {v.desc[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="bg-white py-16 sm:py-20">
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

      {/* Membership tiers */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {locale === "bg" ? "Членство" : "Membership"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-stone-600">
            {locale === "bg"
              ? "Избери плана, който работи за теб."
              : "Choose the plan that works for you."}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {membershipTiers.map((tier) => (
              <div
                key={tier.name.en}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-8 ${
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

                <h3 className="text-xl font-bold text-stone-900">
                  {tier.name[locale]}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-stone-900">
                    €{tier.price}
                  </span>
                  <span className="text-sm text-stone-500">
                    / {locale === "bg" ? "месец" : "month"}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
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

      {/* Recent posts */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          {tr("section_recent_posts", locale)}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
            >
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
    </>
  );
}
