"use client";

import { useState, useEffect } from "react";

type FacebookEmbedProps = {
  href: string;
};

/**
 * Renders a Facebook Page Plugin embed via an iframe.
 *
 * Loads /embeds/facebook.html (static file with FB SDK + fb-page div).
 * Falls back to a direct link if loading takes too long.
 */
export default function FacebookEmbed({ href }: FacebookEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setShowFallback(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-stone-100">
      {!loaded && (
        <div className="flex h-[600px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-blue-600" />
            <div className="text-sm text-stone-400">Loading Facebook…</div>
            {showFallback && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Open on Facebook →
              </a>
            )}
          </div>
        </div>
      )}

      <iframe
        src="/embeds/facebook.html"
        title="Facebook feed"
        className="w-full border-0"
        style={{
          width: "100%",
          maxWidth: "500px",
          minHeight: "600px",
          height: loaded ? "800px" : "600px",
          display: "block",
          margin: "0 auto",
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
