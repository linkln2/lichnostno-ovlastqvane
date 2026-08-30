"use client";

import { useState, useEffect } from "react";

type FacebookEmbedProps = {
  href: string;
};

/**
 * Renders a Facebook Page Plugin embed via an iframe.
 *
 * Loads /embeds/facebook.html (static file with FB SDK + fb-page div).
 */
export default function FacebookEmbed({ href }: FacebookEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    setTimeout(() => setLoaded(true), 3000);
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-stone-100">
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-blue-600" />
            <div className="text-sm text-stone-400">Loading Facebook…</div>
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
          height: "750px",
          display: "block",
          margin: "0 auto",
        }}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}
