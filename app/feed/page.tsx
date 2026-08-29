"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { site } from "@/lib/content";
import TikTokEmbed from "@/components/TikTokEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";

type Tab = "tiktok" | "facebook";

export default function FeedPage() {
  const { locale } = useLocale();
  const [tab, setTab] = useState<Tab>("tiktok");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "tiktok",
      label: tr("feed_tiktok", locale),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
        </svg>
      ),
    },
    {
      key: "facebook",
      label: tr("feed_facebook", locale),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
        </svg>
      ),
    },
  ];

  // Extract TikTok username from the site config URL
  const tiktokUsername = site.tiktok
    .replace("https://www.tiktok.com/@", "")
    .replace(/\/.*$/, "");

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("feed_title", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {tr("feed_subtitle", locale)}
          </p>
        </div>
      </section>

      {/* Feed */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Platform tabs */}
        <div className="flex justify-center gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? t.key === "tiktok"
                    ? "bg-stone-900 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Embed content */}
        <div className="mt-12 flex justify-center">
          {tab === "tiktok" ? (
            <div className="w-full max-w-[780px]">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">
                    {locale === "bg" ? "Последни видеа от" : "Latest videos from"}
                  </span>
                  <a
                    href={site.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-stone-900 hover:text-amber-700"
                  >
                    @{tiktokUsername}
                  </a>
                </div>
                <a
                  href={site.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-stone-400 hover:text-stone-600"
                >
                  {locale === "bg" ? "Отвори в TikTok →" : "Open in TikTok →"}
                </a>
              </div>
              <TikTokEmbed uniqueId={tiktokUsername} mode="creator" />
            </div>
          ) : (
            <div className="w-full max-w-[500px]">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">
                    {locale === "bg" ? "Публикации от" : "Posts from"}
                  </span>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-stone-900 hover:text-blue-700"
                  >
                    Facebook
                  </a>
                </div>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-stone-400 hover:text-stone-600"
                >
                  {locale === "bg" ? "Отвори във Facebook →" : "Open in Facebook →"}
                </a>
              </div>
              <FacebookEmbed href={site.facebook} tabs="timeline" width={500} height={700} />
            </div>
          )}
        </div>

        {/* Follow CTA */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          <a
            href={site.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-stone-900 p-6 font-semibold text-white transition-colors hover:bg-stone-800"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
            {tr("feed_follow_tiktok", locale)}
          </a>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 p-6 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
            </svg>
            {locale === "bg" ? "Последвай ни във Facebook" : "Follow us on Facebook"}
          </a>
        </div>
      </section>
    </>
  );
}
