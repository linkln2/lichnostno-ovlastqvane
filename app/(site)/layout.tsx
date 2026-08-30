import type { Metadata, Viewport } from "next";
import "../globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Личностно овластяване | Personal Empowerment",
  description:
    "Семинари, коучинг и общност за личностно овластяване. Върни си своя вътрешен авторитет.",
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
      </body>
    </html>
  );
}
