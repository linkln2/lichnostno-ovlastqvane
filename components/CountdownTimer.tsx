"use client";

import { useState, useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import { tr } from "@/lib/i18n";
import { launchDate } from "@/lib/content";

function calculateTimeLeft(target: string) {
  const diff = +new Date(target) - +new Date();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatLaunchDate(target: string, locale: "bg" | "en") {
  const d = new Date(target);
  return d.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CountdownTimer({ target }: { target?: string }) {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const activeTarget = target ?? launchDate;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(activeTarget));

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(activeTarget));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTarget]);

  const units = [
    { value: timeLeft.days, label: tr("countdown_days", locale) },
    { value: timeLeft.hours, label: tr("countdown_hours", locale) },
    { value: timeLeft.minutes, label: tr("countdown_minutes", locale) },
    { value: timeLeft.seconds, label: tr("countdown_seconds", locale) },
  ];

  return (
    <div className="w-full">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          {tr("countdown_label", locale)}
        </p>
        <p className="mt-1 text-base font-bold text-stone-800">
          {formatLaunchDate(activeTarget, locale)}
        </p>
      </div>

      {timeLeft.expired ? (
        <p className="mt-6 text-center text-2xl font-bold text-amber-600">
          {locale === "bg" ? "Стартирахме!" : "We're live!"}
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
          {units.map((unit, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl bg-white px-2 py-3 sm:px-5 sm:py-4"
            >
              <span className="text-2xl font-bold tabular-nums text-stone-900 sm:text-4xl">
                {mounted ? pad(unit.value) : "--"}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-wider text-stone-500 sm:text-xs">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-stone-500">
        {tr("countdown_subtitle", locale)}
      </p>
    </div>
  );
}
