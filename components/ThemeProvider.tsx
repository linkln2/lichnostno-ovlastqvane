"use client";

import { useEffect, useState } from "react";

function getTimeTheme(): "dark" | "light" {
  const hour = new Date().getHours();
  // Almost-black dark mode from 19:00 to 06:00
  return hour >= 19 || hour < 6 ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">(() => getTimeTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Re-check every minute so it flips at 06:00 and 19:00
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
