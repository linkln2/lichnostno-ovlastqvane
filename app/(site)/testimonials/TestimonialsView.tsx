"use client";

import { useLocale } from "@/components/LocaleProvider";
import { tr, getLocalized } from "@/lib/i18n";
import { testimonials } from "@/lib/content";

export default function TestimonialsPage() {
  const { locale } = useLocale();

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("nav_testimonials", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Истории от хора, които преминаха през процеса."
              : "Stories from people who went through the process."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6"
            >
              <div className="text-3xl text-amber-300">&ldquo;</div>
              <blockquote className="flex-1 text-sm leading-relaxed text-stone-700">
                {getLocalized(t.text, locale)}
              </blockquote>
              <figcaption className="mt-4 border-t border-stone-100 pt-4">
                <div className="font-semibold text-stone-900">{t.name}</div>
                <div className="text-xs text-stone-500">{getLocalized(t.role, locale)}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
