"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/components/LocaleProvider";

function SuccessContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const t = {
    title: locale === "bg" ? "Добре дошъл в общността!" : "Welcome to the community!",
    body:
      locale === "bg"
        ? "Твоят абонамент е активиран. Ще получиш имейл с потвърждение и детайли за достъп."
        : "Your subscription is now active. You'll receive a confirmation email with access details.",
    dashboard: locale === "bg" ? "Към началото" : "Back to home",
    sessionId: locale === "bg" ? "Идентификатор на сесията" : "Session ID",
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-stone-900">{t.title}</h1>
        <p className="mt-3 text-sm text-stone-600">{t.body}</p>

        {sessionId && (
          <p className="mt-4 rounded-lg bg-stone-100 px-4 py-2 font-mono text-xs text-stone-400">
            {t.sessionId}: {sessionId.slice(0, 20)}…
          </p>
        )}

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
        >
          {t.dashboard}
        </Link>
      </div>
    </section>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
