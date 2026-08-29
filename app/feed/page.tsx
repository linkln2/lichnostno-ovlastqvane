"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { getVideosByPlatform, site, type VideoItem } from "@/lib/content";
import TikTokEmbed from "@/components/TikTokEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";

type Filter = "all" | "tiktok" | "facebook";

export default function FeedPage() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const videos = getVideosByPlatform(filter);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: tr("feed_all", locale) },
    { key: "tiktok", label: tr("feed_tiktok", locale) },
    { key: "facebook", label: tr("feed_facebook", locale) },
  ];

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

      {/* Filter + grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Filter tabs */}
        <div className="flex justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === f.key
                  ? "bg-amber-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Videos */}
        {videos.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="text-5xl">🎬</div>
            <p className="mt-4 text-stone-500">{tr("feed_empty", locale)}</p>
          </div>
        ) : (
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} locale={locale} />
            ))}
          </div>
        )}

        {/* Follow CTA */}
        <div className="mt-16 rounded-2xl bg-stone-900 p-8 text-center">
          <p className="text-lg font-semibold text-white">
            {tr("feed_follow_tiktok", locale)}
          </p>
          <a
            href={site.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-stone-900 transition-colors hover:bg-stone-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
            @azraltar
          </a>
        </div>
      </section>
    </>
  );
}

function VideoCard({ video, locale }: { video: VideoItem; locale: "bg" | "en" }) {
  return (
    <div className="mb-6 break-inside-avoid rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      {/* Platform badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            video.platform === "tiktok"
              ? "bg-stone-900 text-white"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {video.platform === "tiktok" ? "TikTok" : "Facebook"}
        </span>
        <time className="text-xs text-stone-400">{video.date}</time>
      </div>

      {/* Embed */}
      {video.platform === "tiktok" && video.videoId ? (
        <TikTokEmbed videoId={video.videoId} url={video.url} />
      ) : (
        <FacebookEmbed url={video.url} />
      )}

      {/* Caption */}
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        {video.caption[locale]}
      </p>
    </div>
  );
}
