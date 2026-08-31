"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { formatDateRange, type EventItem } from "@/lib/content";

export default function EventsPage({ events }: { events: EventItem[] }) {
  const { locale } = useLocale();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("nav_events", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Запиши се за предстоящи семинари и събития."
              : "Register for upcoming seminars and events."}
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-stone-900">
          {tr("section_upcoming_title", locale)}
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-6 text-stone-500">{tr("no_events", locale)}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {upcoming.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    {formatDateRange(event.date, event.dateEnd, locale)}
                  </span>
                  <span className="inline-flex w-fit items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                    {tr(`event_kind_${event.kind}`, locale)}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-stone-900 group-hover:text-amber-800">
                  {event.title[locale]}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {event.description[locale]}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                  <span className="text-stone-500">📍 {event.location[locale]}</span>
                  <span className="font-semibold text-amber-700">{event.price[locale]}</span>
                </div>
                <span className="mt-4 text-sm font-semibold text-amber-700 group-hover:text-amber-800">
                  {tr("btn_read_more", locale)} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-stone-900">
              {tr("section_past_title", locale)}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {past.map((event) => (
                <div
                  key={event.slug}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-6 opacity-80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit items-center rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold text-stone-600">
                      {formatDateRange(event.date, event.dateEnd, locale)}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-500 ring-1 ring-stone-200">
                      {tr(`event_kind_${event.kind}`, locale)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-stone-700">
                    {event.title[locale]}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">📍 {event.location[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
