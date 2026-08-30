"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { tr } from "@/lib/i18n";

export default function NotFound() {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-amber-200">404</div>
      <p className="mt-4 text-lg text-stone-600">
        {locale === "bg" ? "Страницата не е намерена." : "Page not found."}
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700"
      >
        {tr("btn_back_home", locale)}
      </Link>
    </div>
  );
}
