"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";

type Theme = "dark" | "light";

function getTimeTheme(): Theme {
  const hour = new Date().getHours();
  // Almost-black dark mode from 19:00 to 06:00
  return hour >= 19 || hour < 6 ? "dark" : "light";
}

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  mounted: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  // On mount: read the theme class that the inline script already set.
  // If localStorage has a saved preference, mark it as a manual override
  // so the time-based auto-switch doesn't clobber it.
  useEffect(() => {
    const root = document.documentElement;
    const current = root.classList.contains("dark") ? "dark" : "light";
    setTheme(current);
    if (localStorage.getItem("theme") !== null) {
      setManualOverride(true);
    }
    setMounted(true);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  // Auto-switch by time only if user hasn't manually overridden
  useEffect(() => {
    if (!mounted || manualOverride) return;
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, [mounted, manualOverride]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
    setManualOverride(true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
