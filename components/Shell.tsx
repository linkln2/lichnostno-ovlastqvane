"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LocaleProvider } from "@/components/LocaleProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted ? (pathname?.startsWith("/admin") ?? false) : false;

  return (
    <LocaleProvider>
      {!isAdmin && <Header />}
      {isAdmin ? <>{children}</> : <main className="flex-1">{children}</main>}
      {!isAdmin && <Footer />}
    </LocaleProvider>
  );
}
