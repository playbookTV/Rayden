"use client";

import { useState, useEffect, type ReactNode } from "react";

interface PreviewProps {
  children: ReactNode;
  vertical?: boolean;
  className?: string;
}

type BackgroundMode = "auto" | "light" | "dark";

function useDocTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Watch for theme changes on <html> element
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => checkTheme();
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return isDark;
}

export function Preview({ children, vertical = false, className = "" }: PreviewProps) {
  const [bgMode, setBgMode] = useState<BackgroundMode>("auto");
  const docIsDark = useDocTheme();

  // Resolve the actual theme based on mode
  const resolvedDark = bgMode === "auto" ? docIsDark : bgMode === "dark";

  return (
    <div className="my-6 rounded-lg border border-grey-200 not-prose">
      <div className="flex items-center justify-between gap-3 rounded-t-lg border-b border-grey-200 bg-grey-50 px-3 py-2">
        <span className="text-xs font-medium text-grey-600">Preview</span>
        <div role="group" aria-label="Preview theme" className="flex gap-1">
          {(["auto", "light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={bgMode === mode}
              onClick={() => setBgMode(mode)}
              className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text ${
                bgMode === mode ? "bg-grey-200 text-grey-900" : "text-grey-600 hover:bg-grey-100"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div
        data-preview-theme={resolvedDark ? "dark" : "light"}
        className={`${resolvedDark ? "dark" : "rayden-light"} rounded-b-lg bg-grey-50 text-grey-900 min-h-32 p-6 flex items-center justify-center ${className}`}
      >
        <div
          className={`flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-4 ${vertical ? "flex-col" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
