"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { getEventBySlug, formatDateRange } from "@/lib/content";
import RegistrationForm from "@/components/RegistrationForm";

export default function EventDetailPage() {
  const { locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const event = getEventBySlug(params.slug);

  if (!event) return notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-700 to-amber-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/events"
            className="text-sm text-amber-200 hover:text-amber-100"
          >
            ← {tr("nav_events", locale)}
          </Link>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {event.title[locale]}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-amber-100">
            <span>📅 {formatDateRange(event.date, event.dateEnd, locale)}</span>
            <span>📍 {event.location[locale]}</span>
            <span>💰 {event.price[locale]}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Left: details */}
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {locale === "bg" ? "За събитието" : "About this event"}
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              {event.description[locale]}
            </p>

            <h3 className="mt-8 font-semibold text-stone-900">
              {locale === "bg" ? "Какво ще получиш" : "What you'll get"}
            </h3>
            <ul className="mt-4 space-y-2">
              {event.highlights[locale].map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-600">
                  <span className="mt-0.5 text-amber-600">✦</span>
                  {h}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-semibold text-stone-900">
              {tr("form_package", locale)}
            </h3>
            <div className="mt-4 space-y-3">
              {event.packages.map((pkg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 p-4"
                >
                  <div>
                    <div className="font-semibold text-stone-900">{pkg.name[locale]}</div>
                    <div className="text-sm text-stone-500">{pkg.spots[locale]}</div>
                  </div>
                  <span className="font-bold text-amber-700">{pkg.price[locale]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: registration form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">
                {tr("form_register_for", locale)}
              </h2>
              <p className="mt-1 text-sm text-stone-500">{event.title[locale]}</p>
              <div className="mt-6">
                <RegistrationForm event={event} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
