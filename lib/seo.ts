import type { Metadata } from "next";

const PRODUCTION_URL = "https://lichnostno-ovlastqvane.vercel.app";

function normalize(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim().replace(/\/$/, "");
  if (!trimmed) return null;
  // NEXT_PUBLIC_SERVER_URL is a localhost value in local .env files. Emitting
  // a canonical pointing at localhost is worse than emitting none, so those
  // are rejected outright and the deployment URL is used instead.
  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/.test(trimmed)) return null;
  return trimmed;
}

/**
 * Canonical origin for the site, in preference order:
 *   1. NEXT_PUBLIC_SITE_URL      — explicit override
 *   2. NEXT_PUBLIC_SERVER_URL    — existing app-wide setting
 *   3. VERCEL_PROJECT_PRODUCTION_URL — set automatically on Vercel
 *   4. the known production URL
 *
 * Localhost values are ignored at every step.
 */
export const SITE_URL =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalize(process.env.NEXT_PUBLIC_SERVER_URL) ||
  normalize(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ) ||
  PRODUCTION_URL;

// PNG rather than the smaller WebP: link-preview scrapers (LinkedIn in
// particular) still handle WebP inconsistently. Only crawlers fetch this.
export const DEFAULT_OG_IMAGE = "/logo.png";

type PageMetaInput = {
  /** Page title without the site suffix — the layout template appends it. */
  title: string;
  description: string;
  /** Route path, e.g. "/blog/my-post". Must start with a slash. */
  path: string;
  image?: string;
  /** "article" for blog posts and events, "website" otherwise. */
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * Build per-page metadata with a correct canonical URL.
 *
 * The root layout deliberately does NOT set `alternates.canonical` — doing so
 * made every route declare the homepage as its canonical, which collapses the
 * whole site to a single URL in search results. Each page sets its own here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  noIndex,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "Личностно овластяване",
      locale: "bg_BG",
      alternateLocale: "en_US",
      images: [{ url: image }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
