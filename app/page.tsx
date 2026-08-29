"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import CountdownTimer from "@/components/CountdownTimer";
import { tr } from "@/lib/i18n";
import {
  hero,
  mission,
  values,
  events,
  testimonials,
  blogPosts,
  formatDateRange,
  localized,
} from "@/lib/content";

export default function HomePage() {
  const { locale } = useLocale();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const nextEvent = upcoming[0];
  const steps = [
    { title: tr("step1_title", locale), desc: tr("step1_desc", locale) },
    { title: tr("step2_title", locale), desc: tr("step2_desc", locale) },
    { title: tr("step3_title", locale), desc: tr("step3_desc", locale) },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-stone-50 to-stone-50">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #292524 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-center lg:gap-14">
            {/* Logo with glow + float animation */}
            <div className="relative h-40 w-40 shrink-0 animate-fade-in sm:h-52 sm:w-52 lg:h-72 lg:w-72">
              <div className="absolute inset-0 rounded-full bg-amber-400 blur-3xl animate-glow" />
              <img
                src="/logo.png"
                alt={locale === "bg" ? "Личностно овластяване — лого" : "Personal Empowerment — logo"}
                className="relative h-40 w-40 rounded-full object-cover shadow-xl ring-4 ring-white/60 animate-float sm:h-52 sm:w-52 lg:h-72 lg:w-72"
              />
            </div>
            {/* Text content */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-block rounded-full border border-amber-200 bg-amber-100/60 px-4 py-1 text-xs font-medium text-amber-800 animate-fade-in-up delay-100">
                {tr("hero_badge", locale)}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-[1.1] animate-fade-in-up delay-200">
                {hero.title[locale]}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 animate-fade-in-up delay-300">
                {hero.subtitle[locale]}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start animate-fade-in-up delay-400">
                <Link
                  href="/events"
                  className="w-full rounded-full bg-amber-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md sm:w-auto"
                >
                  {tr("btn_register", locale)}
                </Link>
                <Link
                  href="/contact"
                  className="w-full rounded-full border border-stone-300 bg-white px-6 py-3 text-center font-semibold text-stone-700 transition-all hover:bg-stone-100 hover:shadow-sm sm:w-auto"
                >
                  {tr("hero_cta_secondary", locale)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown to launch */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-12 sm:py-16">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-xl font-bold text-white sm:text-2xl">
            {tr("countdown_title", locale)}
          </h2>
          <div className="mt-6">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("section_mission_title", locale)}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            {mission[locale]}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("section_values_title", locale)}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title.en}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <h3 className="font-semibold text-amber-800">{v.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {v.desc[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next event */}
      {nextEvent && (
        <section className="bg-gradient-to-br from-amber-600 to-amber-800 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-200">
                  {tr("section_next_event_title", locale)}
                </span>
                <h2 className="mt-3 text-3xl font-bold leading-tight">
                  {nextEvent.title[locale]}
                </h2>
                <p className="mt-4 text-amber-100">
                  {nextEvent.description[locale]}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-amber-200">📅</span>
                    {formatDateRange(nextEvent.date, nextEvent.dateEnd, locale)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-amber-200">📍</span>
                    {nextEvent.location[locale]}
                  </span>
                </div>
                <Link
                  href={`/events/${nextEvent.slug}`}
                  className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-amber-800 transition-colors hover:bg-amber-50"
                >
                  {tr("btn_register", locale)}
                </Link>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-amber-100">
                  {locale === "bg" ? "Какво ще получиш" : "What you'll get"}
                </h3>
                <ul className="mt-4 space-y-2">
                  {nextEvent.highlights[locale].map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-50">
                      <span className="mt-0.5 text-amber-300">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          {tr("section_how_title", locale)}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-800">
                {s.title.charAt(0)}
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
            {tr("section_testimonials_title", locale)}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <blockquote className="text-sm leading-relaxed text-stone-700">
                  &ldquo;{t.text[locale]}&rdquo;
                </blockquote>
                <figcaption className="mt-4">
                  <div className="font-semibold text-stone-900">{t.name}</div>
                  <div className="text-xs text-stone-500">{t.role[locale]}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/testimonials"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              {tr("btn_all_testimonials", locale)} →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
          {tr("section_recent_posts", locale)}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-stone-200 bg-white p-6 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
            >
              <time className="text-xs text-stone-400">{post.date}</time>
              <h3 className="mt-2 font-semibold text-stone-900 group-hover:text-amber-800">
                {post.title[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {post.excerpt[locale]}
              </p>
              <span className="mt-3 inline-block text-xs text-stone-400">
                {post.readTime[locale]}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            {tr("btn_all_posts", locale)} →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {locale === "bg"
              ? "Готов/а ли си да поемеш живота си в свои ръце?"
              : "Are you ready to take your life into your own hands?"}
          </h2>
          <p className="mt-4 text-stone-300">
            {locale === "bg"
              ? "Запиши се за следващия семинар или запази консултация. Първата стъпка е най-важната."
              : "Register for the next seminar or book a consultation. The first step is the most important."}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/events"
              className="w-full rounded-full bg-amber-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-amber-700 sm:w-auto"
            >
              {tr("btn_register", locale)}
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-full border border-stone-600 px-6 py-3 text-center font-semibold text-stone-200 transition-colors hover:bg-stone-800 sm:w-auto"
            >
              {tr("hero_cta_secondary", locale)}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
