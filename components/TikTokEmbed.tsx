"use client";

import { useEffect, useRef, useState } from "react";

type TikTokEmbedProps = {
  uniqueId: string;
  mode?: "creator" | "video";
  videoId?: string;
  url?: string;
};

/**
 * Renders a TikTok embed.
 *
 * - mode="creator" (default): Shows the creator's profile with their latest
 *   videos. Auto-fetches from TikTok — no API key needed. Uses data-unique-id.
 * - mode="video": Shows a single video embed. Uses data-video-id.
 *
 * The official TikTok embed script (embed.js) processes blockquote.tiktok-embed
 * elements on the page. For dynamic content (client-side navigation), we
 * re-inject a fresh script element each time to force re-processing.
 */
export default function TikTokEmbed({
  uniqueId,
  mode = "creator",
  videoId,
  url,
}: TikTokEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);

    // Remove any existing TikTok embed script so the new one re-processes
    const existing = document.getElementById("tiktok-embed-script");
    if (existing) existing.remove();

    // Inject a fresh script — the browser will execute it and scan for
    // .tiktok-embed elements, replacing them with iframes.
    const script = document.createElement("script");
    script.id = "tiktok-embed-script";
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Poll for rendered iframe or processed embed
    const checkInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      const iframe = container.querySelector("iframe");
      const embed = container.querySelector(".tiktok-embed");
      // Creator embed: script adds wrapper divs around the blockquote
      // Video embed: script replaces blockquote with iframe
      if (iframe || (embed && embed.children.length > 1)) {
        setLoaded(true);
        clearInterval(checkInterval);
      }
    }, 500);

    // Timeout fallback — show content even if detection fails
    const timeout = setTimeout(() => setLoaded(true), 6000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [uniqueId, mode, videoId]);

  const cite =
    url ||
    (mode === "creator"
      ? `https://www.tiktok.com/@${uniqueId}`
      : `https://www.tiktok.com/@${uniqueId}/video/${videoId}`);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {!loaded && (
        <div className="flex h-[500px] w-full max-w-[780px] items-center justify-center rounded-xl bg-stone-100">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
            <div className="text-sm text-stone-400">Loading TikTok…</div>
          </div>
        </div>
      )}
      {mode === "creator" ? (
        <blockquote
          className="tiktok-embed"
          cite={cite}
          data-unique-id={uniqueId}
          data-embed-from="oembed"
          data-embed-type="creator"
          style={{ maxWidth: "780px", minWidth: "288px", width: "100%" }}
        >
          <section>
            <a
              target="_blank"
              href={`https://www.tiktok.com/@${uniqueId}?refer=creator_embed`}
            >
              @{uniqueId}
            </a>
          </section>
        </blockquote>
      ) : (
        <blockquote
          className="tiktok-embed"
          cite={cite}
          data-video-id={videoId}
          style={{ maxWidth: "380px", minWidth: "288px", width: "100%" }}
        >
          <section></section>
        </blockquote>
      )}
    </div>
  );
}
