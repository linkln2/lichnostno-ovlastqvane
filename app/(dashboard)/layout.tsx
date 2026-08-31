import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getPayloadInstance } from "@/lib/payload";
import { isWhitelisted } from "@/lib/auth";

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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real auth check — proxy.ts only checks cookie presence, not validity.
  // Must match requireStaff: a valid token is not enough, it has to be a
  // whitelisted staff account or any signed-up customer could load the shell.
  const payload = await getPayloadInstance();
  const hdrs = await headers();
  const { user } = await payload.auth({ headers: hdrs });
  if (!user || user.collection !== "staff" || !isWhitelisted(user.email ?? "")) {
    redirect("/membership");
  }

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){var h=new Date().getHours();t=(h>=19||h<6)?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();` }} />
      </head>
      <body
        className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <ThemeProvider>
          {/* Background color blobs for the glass effect to pick up */}
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden dark:opacity-20">
            <div className="absolute -left-24 top-[-10%] h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
            <div className="absolute right-[-10%] top-1/4 h-96 w-96 rounded-full bg-teal-300/40 blur-3xl" />
            <div className="absolute bottom-[-10%] left-1/3 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl" />
          </div>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
