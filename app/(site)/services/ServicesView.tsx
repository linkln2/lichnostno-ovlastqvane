"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { tr, getLocalized, getLocalizedList } from "@/lib/i18n";
import { services } from "@/lib/content";

export default function ServicesPage() {
  const { locale } = useLocale();

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("section_services_title", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Избери формата, която работи за теб — или ги комбинирай."
              : "Choose the format that works for you — or combine them."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="space-y-12">
          {services.map((service) => (
            <div
              key={service.slug}
              className="grid gap-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:grid-cols-2"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <h2 className="text-2xl font-bold text-stone-900">
                    {getLocalized(service.title, locale)}
                  </h2>
                </div>
                <p className="mt-2 text-sm font-medium text-amber-700">
                  {getLocalized(service.who, locale)}
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  {getLocalized(service.desc, locale)}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
                  <span>
                    <strong className="text-stone-700">
                      {locale === "bg" ? "Формат:" : "Format:"}
                    </strong>{" "}
                    {getLocalized(service.format, locale)}
                  </span>
                  <span>
                    <strong className="text-stone-700">
                      {locale === "bg" ? "Продължителност:" : "Duration:"}
                    </strong>{" "}
                    {getLocalized(service.duration, locale)}
                  </span>
                  <span>
                    <strong className="text-stone-700">
                      {tr("price_label", locale)}:
                    </strong>{" "}
                    {getLocalized(service.price, locale)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">
                  {locale === "bg" ? "Какво ще получиш" : "What you'll get"}
                </h3>
                <ul className="mt-4 space-y-2">
                  {getLocalizedList(service.outcomes, locale).map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="mt-0.5 text-amber-600">✦</span>
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {service.slug === "seminars" ? (
                    <Link
                      href="/events"
                      className="inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                    >
                      {tr("btn_all_events", locale)}
                    </Link>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                    >
                      {tr("btn_book_call", locale)}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-stone-900">
            {locale === "bg" ? "Често задавани въпроси" : "Frequently asked questions"}
          </h2>
          <div className="mt-10 space-y-6">
            {(locale === "bg"
              ? [
                  {
                    q: "Трябва ли да имам опит с подобни практики?",
                    a: "Не. Семинарите и сесиите са подходящи както за начинаещи, така и за хора с опит. Важното е да си отворен/а да работиш със себе си.",
                  },
                  {
                    q: "Какво да донеса на семинара?",
                    a: "Удобни дрехи, бутилка вода, тетрадка и химикал. Всичко останало ще ти осигурим. Ако семинарът е в хотел, ние се грижим за настаняването.",
                  },
                  {
                    q: "Мога ли да отменя регистрацията си?",
                    a: "Да. Отказ до 14 дни преди събитието — пълно възстановяване. След този срок — кредит за следващо събитие.",
                  },
                  {
                    q: "Сесиите онлайн ли са или на живо?",
                    a: "Семинарите са на живо. Коучинг сесиите могат да бъдат онлайн или на живо в Бургас. Груповите програми са онлайн.",
                  },
                ]
              : [
                  {
                    q: "Do I need experience with such practices?",
                    a: "No. The seminars and sessions are suitable for both beginners and experienced people. What matters is being open to working with yourself.",
                  },
                  {
                    q: "What should I bring to the seminar?",
                    a: "Comfortable clothes, a water bottle, a notebook and pen. We provide everything else. If the seminar is at a hotel, we handle accommodation.",
                  },
                  {
                    q: "Can I cancel my registration?",
                    a: "Yes. Cancellation up to 14 days before the event — full refund. After that — credit for the next event.",
                  },
                  {
                    q: "Are sessions online or in person?",
                    a: "Seminars are in person. Coaching sessions can be online or in person in Burgas. Group programs are online.",
                  },
                ]
            ).map((item, i) => (
              <div key={i} className="border-b border-stone-200 pb-6">
                <h3 className="font-semibold text-stone-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
