import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Studio · Coaching Dashboard",
  description: "Admin dashboard for the coaching studio.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${fraunces.variable} h-full antialiased`}>
      <body
        className="min-h-full bg-zinc-50 text-zinc-900"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {/* Background color blobs for the glass effect to pick up */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-[-10%] h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="absolute right-[-10%] top-1/4 h-96 w-96 rounded-full bg-teal-300/40 blur-3xl" />
          <div className="absolute bottom-[-10%] left-1/3 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
