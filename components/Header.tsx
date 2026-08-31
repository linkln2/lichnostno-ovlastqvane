"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import { useTheme } from "./ThemeProvider";
import { tr, localeNames, type Locale } from "@/lib/i18n";
import { site } from "@/lib/content";

const navItems: { href: string; key: string }[] = [
  { href: "/", key: "nav_home" },
  { href: "/events", key: "nav_events" },
  { href: "/shop", key: "nav_shop" },
  { href: "/membership", key: "nav_membership" },
  { href: "/blog", key: "nav_blog" },
];

export default function Header() {
  const { locale, setLocale } = useLocale();
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isMember: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.collection === "customers") {
          // Check entitlements for membership status
          fetch("/api/entitlements", { credentials: "include" })
            .then((r) => (r.ok ? r.json() : null))
            .then((ent) => {
              setUser({
                name: data.user.name || data.user.email,
                email: data.user.email,
                isMember: ent?.hasActiveMembership || false,
              });
            })
            .catch(() => {
              setUser({ name: data.user.name || data.user.email, email: data.user.email, isMember: false });
            });
        }
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-stone-50 backdrop-blur-md dark:border-stone-700/60 dark:bg-stone-900/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + name */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* Logo — single img, CSS handles dark mode swap */}
          <img
            src="/logo.webp"
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
          {/* Inner Circle — only for members */}
          {user?.isMember && (
            <Link
              href="/inner-circle"
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive("/inner-circle")
                  ? "bg-amber-100 text-amber-900"
                  : "text-amber-700 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {locale === "bg" ? "Вътрешен кръг" : "Inner Circle"}
            </Link>
          )}
        </nav>

        {/* Right: theme toggle + language + auth + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            aria-label={theme === "dark" ? (locale === "bg" ? "Светъл режим" : "Light mode") : (locale === "bg" ? "Тъмен режим" : "Dark mode")}
            title={theme === "dark" ? (locale === "bg" ? "Светъл режим" : "Light mode") : (locale === "bg" ? "Тъмен режим" : "Dark mode")}
          >
            {mounted && theme === "dark" ? (
              /* Sun icon — click to go light */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Moon icon — click to go dark */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div className="flex items-center rounded-full border border-stone-300 bg-white p-0.5 dark:border-stone-600 dark:bg-stone-800">
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

          {user ? (
            /* Logged in — show Account button */
            <Link
              href="/account"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all hover:shadow-md"
              style={{ backgroundColor: "#fbbf24", color: "#000000" }}
              aria-label={locale === "bg" ? "Профил" : "Account"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden sm:inline">{locale === "bg" ? "Профил" : "Account"}</span>
            </Link>
          ) : (
            /* Not logged in — Enter Realm goes to membership tiers */
            <Link
              href="/membership"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all hover:shadow-md"
              style={{ backgroundColor: "#fbbf24", color: "#000000" }}
              aria-label={locale === "bg" ? "Влез в царството" : "Enter Realm"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="hidden sm:inline">{locale === "bg" ? "Влез в царството" : "Enter Realm"}</span>
            </Link>
          )}

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
        <nav className="border-t border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-700 dark:bg-stone-900 md:hidden">
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
            {/* Inner Circle in mobile menu — only for members */}
            {user?.isMember && (
              <Link
                href="/inner-circle"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {locale === "bg" ? "Вътрешен кръг" : "Inner Circle"}
              </Link>
            )}
            {/* Theme toggle in mobile menu */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-700"
            >
              {mounted && theme === "dark" ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  {locale === "bg" ? "Светъл режим" : "Light mode"}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  {locale === "bg" ? "Тъмен режим" : "Dark mode"}
                </>
              )}
            </button>

            <Link
              href={user ? "/account" : "/membership"}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full px-4 py-2 text-center text-sm font-bold"
              style={{ backgroundColor: "#fbbf24", color: "#000000" }}
            >
              {user
                ? (locale === "bg" ? "Профил" : "Account")
                : (locale === "bg" ? "Влез в царството" : "Enter Realm")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
