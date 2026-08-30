import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://lichnostno-ovlastqvane.vercel.app"),
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
    url: "https://lichnostno-ovlastqvane.vercel.app",
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
  alternates: {
    canonical: "https://lichnostno-ovlastqvane.vercel.app",
    languages: {
      bg: "https://lichnostno-ovlastqvane.vercel.app",
      en: "https://lichnostno-ovlastqvane.vercel.app",
    },
  },
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
    <html lang="bg" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
