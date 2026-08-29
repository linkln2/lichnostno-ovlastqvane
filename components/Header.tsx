"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "./LocaleProvider";
import { tr, localeNames, type Locale } from "@/lib/i18n";
import { site } from "@/lib/content";

const navItems: { href: string; key: string }[] = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/services", key: "nav_services" },
  { href: "/events", key: "nav_events" },
  { href: "/testimonials", key: "nav_testimonials" },
  { href: "/feed", key: "nav_feed" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
];

export default function Header() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-stone-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/logo.png"
            alt={locale === "bg" ? site.name : site.nameEn}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="hidden text-sm font-semibold tracking-tight text-stone-800 sm:block">
            {locale === "bg" ? site.name : site.nameEn}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-amber-100 text-amber-900"
                  : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
              }`}
            >
              {tr(item.key, locale)}
            </Link>
          ))}
        </nav>

        {/* Right: language + register CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-stone-300 bg-white p-0.5">
            {(["bg", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  locale === l
                    ? "bg-stone-800 text-white"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                aria-label={tr("lang_toggle", locale)}
              >
                {localeNames[l]}
              </button>
            ))}
          </div>
          <Link
            href="/events"
            className="hidden rounded-full bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 sm:block"
          >
            {tr("nav_register", locale)}
          </Link>
          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-200 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-stone-200 bg-stone-50 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(item.href)
                    ? "bg-amber-100 text-amber-900"
                    : "text-stone-700 hover:bg-stone-200"
                }`}
              >
                {tr(item.key, locale)}
              </Link>
            ))}
            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-amber-600 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              {tr("nav_register", locale)}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
