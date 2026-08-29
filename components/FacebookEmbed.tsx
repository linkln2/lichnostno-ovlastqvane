"use client";

import { useEffect, useRef, useState } from "react";

type FacebookEmbedProps = {
  url: string;
};

/**
 * Renders a Facebook video/post embed using the Facebook SDK.
 */
export default function FacebookEmbed({ url }: FacebookEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sdkId = "facebook-jssdk";
    if (!document.getElementById(sdkId)) {
      const script = document.createElement("script");
      script.id = sdkId;
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Trigger FB SDK parse on this element
    const checkInterval = setInterval(() => {
      if (window.FB) {
        window.FB.XFBML.parse(containerRef.current || undefined);
        const fbVideo = containerRef.current?.querySelector(".fb-video");
        if (fbVideo) {
          setLoaded(true);
          clearInterval(checkInterval);
        }
      }
    }, 800);

    return () => clearInterval(checkInterval);
  }, [url]);

  return (
    <div ref={containerRef} className="relative">
      {!loaded && (
        <div className="flex h-[400px] w-full max-w-[500px] items-center justify-center rounded-xl bg-stone-100">
          <div className="animate-pulse text-sm text-stone-400">Loading Facebook…</div>
        </div>
      )}
      <div
        className="fb-video"
        data-href={url}
        data-width="500"
        data-show-text="true"
      />
    </div>
  );
}

// Type augmentation for FB SDK
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (node?: HTMLElement | null) => void;
      };
    };
  }
}
