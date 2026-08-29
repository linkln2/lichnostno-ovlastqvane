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
 * elements on the page.
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
    const scriptId = "tiktok-embed-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Poll for rendered iframe/content
    const checkInterval = setInterval(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      const embedContent = containerRef.current?.querySelector(".tiktok-embed");
      if (iframe || (embedContent && embedContent.children.length > 1)) {
        setLoaded(true);
        clearInterval(checkInterval);
      }
    }, 600);

    // Re-trigger script execution for dynamic content
    const clone = script.cloneNode(true) as HTMLScriptElement;
    script.replaceWith(clone);

    // Timeout fallback — show content even if detection fails
    const timeout = setTimeout(() => setLoaded(true), 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [uniqueId, mode, videoId]);

  const cite = url || (mode === "creator" ? `https://www.tiktok.com/@${uniqueId}` : `https://www.tiktok.com/@${uniqueId}/video/${videoId}`);

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
