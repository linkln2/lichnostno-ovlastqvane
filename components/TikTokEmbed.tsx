"use client";

import { useState, useEffect } from "react";

type TikTokEmbedProps = {
  username: string;
};

/**
 * Renders a TikTok creator profile embed via an iframe.
 *
 * Loads /embeds/tiktok.html (static file with TikTok blockquote + embed.js).
 * The iframe ensures embed.js runs fresh each time.
 */
export default function TikTokEmbed({ username }: TikTokEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  // Give the embed.js time to process after the iframe loads
  function handleLoad() {
    // Wait 3s after iframe loads for TikTok to render its content
    setTimeout(() => setLoaded(true), 3000);
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-stone-100">
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
            <div className="text-sm text-stone-400">
              Loading TikTok @{username}…
            </div>
          </div>
        </div>
      )}
      <iframe
        src="/embeds/tiktok.html"
        title={`TikTok @${username}`}
        className="w-full border-0"
        style={{
          width: "100%",
          maxWidth: "780px",
          height: "750px",
          display: "block",
          margin: "0 auto",
        }}
        onLoad={handleLoad}
        loading="lazy"
        allow="fullscreen; encrypted-media"
      />
    </div>
  );
}
