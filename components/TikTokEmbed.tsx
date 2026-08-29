"use client";

import { useState, useEffect } from "react";

type TikTokEmbedProps = {
  username: string;
};

/**
 * Renders a TikTok creator profile embed via an iframe.
 *
 * Loads /embeds/tiktok.html (a static file with the TikTok blockquote + embed.js).
 * The iframe approach ensures embed.js runs fresh each time, avoiding
 * client-side navigation re-scan issues.
 */
export default function TikTokEmbed({ username }: TikTokEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Show fallback link after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setShowFallback(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-stone-100">
      {/* Loading state */}
      {!loaded && (
        <div className="flex h-[600px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
            <div className="text-sm text-stone-400">
              Loading TikTok @{username}…
            </div>
            {showFallback && (
              <a
                href={`https://www.tiktok.com/@${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
              >
                Open @{username} on TikTok →
              </a>
            )}
          </div>
        </div>
      )}

      {/* The actual embed iframe */}
      <iframe
        src="/embeds/tiktok.html"
        title={`TikTok @${username}`}
        className="w-full border-0"
        style={{
          width: "100%",
          maxWidth: "780px",
          minHeight: "600px",
          height: loaded ? "800px" : "600px",
          display: "block",
          margin: "0 auto",
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
      />
    </div>
  );
}
