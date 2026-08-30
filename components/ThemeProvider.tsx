"use client";

import { useEffect, useState } from "react";

function getTimeTheme(): "dark" | "light" {
  const hour = new Date().getHours();
  // Almost-black dark mode from 19:00 to 06:00
  return hour >= 19 || hour < 6 ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with light on server, switch to correct theme after mount
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const correctTheme = getTimeTheme();
    setTheme(correctTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    // Re-check every minute so it flips at 06:00 and 19:00
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

  return <>{children}</>;
}
