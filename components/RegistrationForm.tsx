"use client";

import { useState } from "react";
import { useLocale } from "./LocaleProvider";
import { tr } from "@/lib/i18n";
import type { EventItem } from "@/lib/content";

export default function RegistrationForm({ event }: { event: EventItem }) {
  const { locale } = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const payload = {
      eventSlug: event.slug,
      eventTitle: event.title[locale],
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      package: formData.get("package"),
      notes: formData.get("notes"),
      locale,
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-3xl">✓</div>
        <p className="mt-3 font-semibold text-green-800">{tr("form_success", locale)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
            {tr("form_phone", locale)} <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            {tr("form_city", locale)}
          </label>
          <input
            name="city"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          {tr("form_package", locale)} <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 space-y-2">
          {event.packages.map((pkg, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-stone-300 p-3 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="package"
                  value={pkg.name[locale]}
                  required
                  defaultChecked={i === 0}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-semibold text-stone-900">{pkg.name[locale]}</div>
                  <div className="text-xs text-stone-500">{pkg.spots[locale]}</div>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-700">{pkg.price[locale]}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          {tr("form_notes", locale)}
        </label>
        <textarea
          name="notes"
          rows={3}
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
        {status === "submitting" ? tr("loading", locale) : tr("btn_submit", locale)}
      </button>
    </form>
  );
}
