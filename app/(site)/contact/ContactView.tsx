"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";
import { site } from "@/lib/content";

export default function ContactPage() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          locale,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            {tr("nav_contact", locale)}
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            {locale === "bg"
              ? "Имате въпрос? Пишете ни — отговаряме бързо."
              : "Have a question? Write to us — we reply quickly."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {locale === "bg" ? "Директен контакт" : "Direct contact"}
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <div className="text-sm text-stone-500">{tr("form_email", locale)}</div>
                  <a href={`mailto:${site.email}`} className="font-medium text-stone-900 hover:text-amber-700">
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <div className="text-sm text-stone-500">{tr("form_phone", locale)}</div>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-medium text-stone-900 hover:text-amber-700">
                    {site.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <div className="text-sm text-stone-500">{tr("location_label", locale)}</div>
                  <div className="font-medium text-stone-900">{site.city[locale]}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📘</span>
                <div>
                  <div className="text-sm text-stone-500">Facebook</div>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-900 hover:text-amber-700"
                  >
                    {locale === "bg" ? "Страницата ни" : "Our page"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📷</span>
                <div>
                  <div className="text-sm text-stone-500">Instagram</div>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-900 hover:text-amber-700"
                  >
                    @lichnostno_ovlastyavane
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🎵</span>
                <div>
                  <div className="text-sm text-stone-500">TikTok</div>
                  <a
                    href={site.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-stone-900 hover:text-amber-700"
                  >
                    @azraltar
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              {status === "success" ? (
                <div className="rounded-xl bg-green-50 p-6 text-center">
                  <div className="text-3xl">✓</div>
                  <p className="mt-3 font-semibold text-green-800">
                    {tr("form_contact_success", locale)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">
                      {tr("form_name", locale)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">
                      {tr("form_email", locale)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">
                      {tr("form_message", locale)} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  {status === "error" && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      {tr("form_error", locale)}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full rounded-full bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
                  >
                    {status === "submitting" ? tr("loading", locale) : tr("btn_send", locale)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
