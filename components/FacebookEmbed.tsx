"use client";

import { useEffect, useRef, useState } from "react";

type FacebookEmbedProps = {
  href: string;
  tabs?: "timeline" | "events" | "messages" | "videos";
  width?: number;
  height?: number;
};

/**
 * Renders a Facebook Page Plugin embed.
 *
 * Uses the Facebook SDK to render a fb-page div that shows the page's
 * timeline/videos. Auto-fetches from Facebook — no API key needed.
 *
 * Note: This only works with Facebook Pages, not personal profiles.
 * If the URL is a personal profile, the embed may not render. In that case,
 * a fallback link to the profile is shown.
 */
export default function FacebookEmbed({
  href,
  tabs = "timeline",
  width = 500,
  height = 600,
}: FacebookEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const sdkId = "facebook-jssdk";
    if (!document.getElementById(sdkId)) {
      const script = document.createElement("script");
      script.id = sdkId;
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.FB) {
        window.FB.XFBML.parse(containerRef.current || undefined);
        const fbPage = containerRef.current?.querySelector(".fb-page");
        if (fbPage && fbPage.children.length > 0) {
          setLoaded(true);
          clearInterval(checkInterval);
        }
      }
      // After ~10 seconds, show fallback
      if (attempts > 12) {
        setFailed(true);
        clearInterval(checkInterval);
      }
    }, 800);

    return () => clearInterval(checkInterval);
  }, [href, tabs]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {!loaded && !failed && (
        <div className="flex h-[600px] w-full items-center justify-center rounded-xl bg-stone-100">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-blue-600" />
            <div className="text-sm text-stone-400">Loading Facebook…</div>
          </div>
        </div>
      )}
      {failed && (
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-xl bg-stone-100">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
          </svg>
          <p className="text-sm text-stone-500 text-center max-w-xs">
            Facebook embed couldn&apos;t load. This may be a personal profile
            rather than a Page.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open on Facebook →
          </a>
        </div>
      )}
      <div
        className="fb-page"
        data-href={href}
        data-tabs={tabs}
        data-width={width}
        data-height={height}
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
        style={{ width: "100%", maxWidth: `${width}px` }}
      />
    </div>
  );
}

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (node?: HTMLElement | null) => void;
      };
    };
  }
}
