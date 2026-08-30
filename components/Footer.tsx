"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { tr } from "@/lib/i18n";
import { site } from "@/lib/content";

const navItems: { href: string; key: string }[] = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/events", key: "nav_events" },
  { href: "/testimonials", key: "nav_testimonials" },
  { href: "/feed", key: "nav_feed" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
];

const exploreItems: { href: string; labelBg: string; labelEn: string }[] = [
  { href: "/shop", labelBg: "Магазин", labelEn: "Shop" },
  { href: "/membership", labelBg: "Членство", labelEn: "Memberships" },
  { href: "/services", labelBg: "Услуги", labelEn: "Services" },
  { href: "/legal/terms", labelBg: "Общи условия", labelEn: "Terms" },
  { href: "/legal/privacy", labelBg: "Поверителност", labelEn: "Privacy" },
  { href: "/legal/refund", labelBg: "Възстановяване", labelEn: "Refunds" },
];

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Brand — spans full width on mobile, 1 col on desktop */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" />
              <span className="font-semibold text-stone-800">
                {locale === "bg" ? site.name : site.nameEn}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-stone-500">
              {tr("footer_tagline", locale)}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {tr("footer_nav", locale)}
            </h3>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700"
                  >
                    {tr(item.key, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {locale === "bg" ? "Разгледай" : "Explore"}
            </h3>
            <ul className="mt-3 space-y-2">
              {exploreItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-600 hover:text-amber-700"
                  >
                    {locale === "bg" ? item.labelBg : item.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {tr("footer_contact", locale)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-amber-700">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-amber-700">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>{site.city[locale]}</li>
            </ul>
            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              {tr("footer_follow", locale)}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06.41-2.23.06-1.27.07-1.65.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46.72 2.13 1.38.66.67 1.07 1.34 1.38 2.13.3.76.5 1.64.56 2.91.06 1.28.07 1.69.07 4.95s-.01 3.67-.07 4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
                </svg>
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
                <span className="hidden sm:inline">TikTok</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6 sm:mt-10">
          <p className="text-center text-xs font-medium text-stone-600 sm:text-sm">
            © {year} {locale === "bg" ? site.name : site.nameEn}. {tr("footer_rights", locale)}. Made with ❤️ by Georgi
          </p>
        </div>
      </div>
    </footer>
  );
}
