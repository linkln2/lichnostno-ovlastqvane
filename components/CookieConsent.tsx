"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if no choice has been made yet
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on initial page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Bottom sheet on mobile, centered card on desktop */}
      <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
          <h3 className="text-sm font-semibold text-stone-900">
            🍪 Cookies
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-stone-600">
            We use essential cookies to make the site work, and analytics
            cookies to understand how you use it. You can choose which to
            allow.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Essential only
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 rounded-full bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Accept all
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-stone-400">
            <a href="/legal/privacy" className="underline hover:text-stone-600">
              Privacy policy
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
