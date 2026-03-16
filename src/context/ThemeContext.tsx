"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** Current theme setting (can be "system") */
  theme: Theme;
  /** Resolved theme after applying system preference */
  resolvedTheme: ResolvedTheme;
  /** Update the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "rayden-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme if no stored preference exists */
  defaultTheme?: Theme;
  /** Storage key for persisting theme preference */
  storageKey?: string;
  /** Disable system theme detection */
  disableSystemTheme?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
  disableSystemTheme = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return getStoredTheme() || defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // Listen for system theme changes
  useEffect(() => {
    if (disableSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [disableSystemTheme]);

  // Resolve the actual theme
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === "system") {
      return disableSystemTheme ? "light" : systemTheme;
    }
    return theme;
  }, [theme, systemTheme, disableSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook that returns only the resolved theme (light or dark).
 * Useful for components that just need to know the current theme.
 */
export function useResolvedTheme(): ResolvedTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}
