import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SITE_URL } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Личностно овластяване | Personal Empowerment",
    template: "%s — Личностно овластяване",
  },
  description:
    "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
  keywords: [
    "личностно овластяване",
    "personal empowerment",
    "коучинг",
    "coaching",
    "семинари",
    "seminars",
    "медитация",
    "meditation",
    "Theta терапия",
    "theta healing",
    "констелации",
    "constellations",
    "Бургас",
    "Burgas",
    "България",
    "Bulgaria",
  ],
  authors: [{ name: "Личностно овластяване" }],
  creator: "Личностно овластяване",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    alternateLocale: "en_US",
    siteName: "Личностно овластяване",
    title: "Личностно овластяване | Personal Empowerment",
    description:
      "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "Личностно овластяване",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Личностно овластяване | Personal Empowerment",
    description:
      "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
    images: ["/logo.png"],
  },
  // No `alternates` here on purpose. A canonical set on the root layout is
  // inherited by every route, which made the whole site declare the homepage
  // as its canonical. Each page sets its own via `pageMetadata()` in lib/seo.ts.
  // `languages` is also omitted: BG/EN share one URL (locale is client-side),
  // so there are no distinct per-language URLs to advertise.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className={`${inter.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){var h=new Date().getHours();t=(h>=19||h<6)?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();` }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
