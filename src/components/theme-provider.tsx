"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AccentTheme = "orange" | "blue";

interface ThemeContextValue {
  theme: AccentTheme;
  setTheme: (t: AccentTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "ca-study-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy-init from localStorage to avoid reading on every render and to avoid
  // calling setState inside an effect.
  const [theme, setThemeState] = useState<AccentTheme>(() => {
    if (typeof window === "undefined") return "orange";
    const stored = localStorage.getItem(STORAGE_KEY) as AccentTheme | null;
    return stored === "blue" || stored === "orange" ? stored : "orange";
  });

  const setTheme = useCallback((t: AccentTheme) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, t);
      document.documentElement.setAttribute("data-theme", t);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "orange" ? "blue" : "orange";
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.setAttribute("data-theme", next);
      }
      return next;
    });
  }, []);

  // ensure DOM attribute is in sync on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
