"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import { tr, localeNames, type Locale } from "@/lib/i18n";
import { site } from "@/lib/content";

const mainNavItems: { href: string; key: string }[] = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/services", key: "nav_services" },
  { href: "/events", key: "nav_events" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
];

const moreNavItems: { href: string; key: string }[] = [
  { href: "/membership", key: "nav_membership" },
  { href: "/shop", key: "nav_shop" },
  { href: "/testimonials", key: "nav_testimonials" },
  { href: "/feed", key: "nav_feed" },
];

const allNavItems = [...mainNavItems, ...moreNavItems];

export default function Header() {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Desktop main nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-2.5 py-1.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-amber-100 text-amber-900"
                  : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
              }`}
            >
              {tr(item.key, locale)}
            </Link>
          ))}

          {/* More dropdown for extra links */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`rounded-full px-2.5 py-1.5 text-sm transition-colors ${
                moreNavItems.some((i) => isActive(i.href))
                  ? "bg-amber-100 text-amber-900"
                  : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
              }`}
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              {locale === "bg" ? "Още" : "More"} ▾
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-xl border border-stone-200 bg-white py-1.5 shadow-lg">
                {moreNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-amber-50 font-medium text-amber-900"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {tr(item.key, locale)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: language + mobile toggle */}
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
          <Link
            href="/login"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition-colors hover:bg-stone-800 hover:text-white"
            aria-label={locale === "bg" ? "Вход" : "Login"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
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
            {allNavItems.map((item) => (
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
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg border border-stone-300 px-3 py-2 text-center text-sm font-semibold text-stone-700"
            >
              {locale === "bg" ? "Вход" : "Login"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
