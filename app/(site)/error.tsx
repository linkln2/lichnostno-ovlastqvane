"use client";

import { useEffect } from "react";
import Link from "next/link";

// Error boundary for the public site. Without this, any thrown render error
// takes down the whole app with the default Next.js error screen.
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Site route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Нещо се обърка
      </h1>
      <p className="text-stone-600 dark:text-stone-400">
        Something went wrong loading this page. Please try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="min-h-[44px] rounded-full bg-amber-600 px-6 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          Опитай отново / Try again
        </button>
        <Link
          href="/"
          className="min-h-[44px] rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          Начало / Home
        </Link>
      </div>
      {error.digest && (
        <p className="text-xs text-stone-400">Reference: {error.digest}</p>
      )}
    </div>
  );
}
