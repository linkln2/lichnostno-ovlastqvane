"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { tr } from "@/lib/i18n";
import { site } from "@/lib/content";

const navItems: { href: string; key: string }[] = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/services", key: "nav_services" },
  { href: "/events", key: "nav_events" },
  { href: "/testimonials", key: "nav_testimonials" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
];

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-semibold text-stone-800">
                {locale === "bg" ? site.name : site.nameEn}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-stone-500">
              {tr("footer_tagline", locale)}
            </p>
          </div>

          {/* Nav */}
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
                  {site.phone}
                </a>
              </li>
              <li>{site.city[locale]}</li>
            </ul>
            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              {tr("footer_follow", locale)}
            </h3>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          © {year} {locale === "bg" ? site.name : site.nameEn}. {tr("footer_rights", locale)}
        </div>
      </div>
    </footer>
  );
}
