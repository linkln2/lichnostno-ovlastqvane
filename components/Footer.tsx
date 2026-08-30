"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { tr } from "@/lib/i18n";
import { site } from "@/lib/content";
import styles from "./Footer.module.css";

type FooterLink = {
  href: string;
  labelBg: string;
  labelEn: string;
};

type FooterGroup = {
  titleBg: string;
  titleEn: string;
  links: FooterLink[];
};

const footerGroups: FooterGroup[] = [
  {
    titleBg: "За нас",
    titleEn: "Company",
    links: [
      { href: "/", labelBg: "Начало", labelEn: "Home" },
      { href: "/about", labelBg: "За нас", labelEn: "About" },
      { href: "/testimonials", labelBg: "Отзиви", labelEn: "Testimonials" },
    ],
  },
  {
    titleBg: "Открий",
    titleEn: "Discover",
    links: [
      { href: "/events", labelBg: "Събития", labelEn: "Events" },
      { href: "/feed", labelBg: "Видеа", labelEn: "Videos" },
      { href: "/blog", labelBg: "Блог", labelEn: "Blog" },
    ],
  },
  {
    titleBg: "Възможности",
    titleEn: "Offerings",
    links: [
      { href: "/shop", labelBg: "Магазин", labelEn: "Shop" },
      { href: "/membership", labelBg: "Членство", labelEn: "Membership" },
      { href: "/services", labelBg: "Услуги", labelEn: "Services" },
    ],
  },
  {
    titleBg: "Помощ",
    titleEn: "Support",
    links: [
      { href: "/contact", labelBg: "Контакт", labelEn: "Contact" },
      { href: "/legal/terms", labelBg: "Общи условия", labelEn: "Terms" },
      { href: "/legal/privacy", labelBg: "Поверителност", labelEn: "Privacy" },
    ],
  },
];

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt={locale === "bg" ? site.name : site.nameEn}
              className="h-20 w-20 shrink-0 rounded-full object-cover dark:hidden sm:h-24 sm:w-24"
            />
            <img
              src="/pictures/dark-mode-logo.webp"
              alt={locale === "bg" ? site.name : site.nameEn}
              className="hidden h-20 w-20 shrink-0 rounded-full object-cover dark:block sm:h-24 sm:w-24"
            />
            <div>
              <p className="font-semibold text-stone-800">
                {locale === "bg" ? site.name : site.nameEn}
              </p>
              <p className="mt-1 max-w-md text-sm leading-6 text-stone-500">
                {tr("footer_tagline", locale)}
              </p>
            </div>
          </div>
        </div>

        <nav className={`${styles.footerGrid} py-8`} aria-label={locale === "bg" ? "Навигация във футъра" : "Footer navigation"}>
          {footerGroups.map((group) => (
            <div key={group.titleEn}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {locale === "bg" ? group.titleBg : group.titleEn}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-600 transition-colors hover:text-amber-700"
                    >
                      {locale === "bg" ? link.labelBg : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-5 border-t border-stone-200 pt-6 text-sm text-stone-500 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-amber-700">
              {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-amber-700">
              {site.phoneDisplay}
            </a>
            <span>{site.city[locale]}</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-700">
              Facebook
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-700">
              Instagram
            </a>
            <a href={site.tiktok} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-700">
              TikTok
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-stone-400">
          © {year} {locale === "bg" ? site.name : site.nameEn}. {tr("footer_rights", locale)}. Made with <span className="text-rose-500" aria-label="love">♥</span> by Georgi
        </p>
      </div>
    </footer>
  );
}
