"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Globe, Languages, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────

export type DashboardLocale = "bg" | "en" | "es" | "it" | "de";

export const dashboardLocales: DashboardLocale[] = ["bg", "en", "es", "it", "de"];

export const dashboardLocaleNames: Record<DashboardLocale, string> = {
  bg: "БГ",
  en: "EN",
  es: "ES",
  it: "IT",
  de: "DE",
};

export const dashboardLocaleFull: Record<DashboardLocale, string> = {
  bg: "Български",
  en: "English",
  es: "Español",
  it: "Italiano",
  de: "Deutsch",
};

type DashboardLangContextValue = {
  lang: DashboardLocale;
  setLang: (l: DashboardLocale) => void;
  translate: () => void;
  translating: boolean;
  registerTranslate: (fn: () => Promise<void>) => void;
};

const DashboardLangContext = createContext<DashboardLangContextValue | null>(null);

export function useDashboardLang() {
  const ctx = useContext(DashboardLangContext);
  if (!ctx) {
    throw new Error("useDashboardLang must be used within DashboardLangProvider");
  }
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────

export function DashboardLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<DashboardLocale>("bg");
  const [translating, setTranslating] = useState(false);
  const translateFnRef = useRef<(() => Promise<void>) | null>(null);

  const registerTranslate = useCallback((fn: () => Promise<void>) => {
    translateFnRef.current = fn;
  }, []);

  const translate = useCallback(async () => {
    if (!translateFnRef.current) return;
    setTranslating(true);
    try {
      await translateFnRef.current();
    } finally {
      setTranslating(false);
    }
  }, []);

  return (
    <DashboardLangContext.Provider
      value={{ lang, setLang, translate, translating, registerTranslate }}
    >
      {children}
    </DashboardLangContext.Provider>
  );
}

// ─── Dropdown (for navbar) ───────────────────────────────────────

export function LangDropdown() {
  const { lang, setLang, translate, translating } = useDashboardLang();
  const [open, setOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-lang-dropdown]");
      if (!el) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" data-lang-dropdown>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/40 text-zinc-600 backdrop-blur-xl transition-colors hover:text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white"
        aria-label="Language"
        title={`Language: ${dashboardLocaleFull[lang]}`}
      >
        <Globe className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-white/60 bg-white/95 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95">
          {/* Language list */}
          <div className="p-1.5">
            <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              Content language
            </p>
            {dashboardLocales.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  lang === l
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-6 text-xs font-bold">{dashboardLocaleNames[l]}</span>
                  {dashboardLocaleFull[l]}
                </span>
                {lang === l && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Translate button */}
          <div className="border-t border-zinc-200/60 p-1.5 dark:border-white/10">
            <button
              onClick={() => {
                translate();
                setOpen(false);
              }}
              disabled={translating || lang === "bg"}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-40 dark:text-amber-300 dark:hover:bg-amber-900/20"
            >
              <Languages className="h-4 w-4" />
              {translating ? "Translating…" : `BG → ${dashboardLocaleNames[lang]}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
