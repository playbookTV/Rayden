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

  const bgClasses = resolvedDark ? "bg-grey-900" : "bg-white";

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-grey-200 dark:border-grey-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-grey-200 bg-grey-50 px-4 py-2 dark:border-grey-700 dark:bg-grey-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setBgMode("auto")}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              bgMode === "auto"
                ? "bg-white text-grey-900 shadow-sm dark:bg-grey-700 dark:text-white"
                : "text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200"
            }`}
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() => setBgMode("light")}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              bgMode === "light"
                ? "bg-white text-grey-900 shadow-sm dark:bg-grey-700 dark:text-white"
                : "text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200"
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setBgMode("dark")}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              bgMode === "dark"
                ? "bg-white text-grey-900 shadow-sm dark:bg-grey-700 dark:text-white"
                : "text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div
        className={`${bgClasses} ${resolvedDark ? "dark" : ""} min-h-[400px] p-6 transition-colors flex items-center justify-center not-prose ${className}`}
      >
        <div
          className={`flex flex-wrap items-center justify-center gap-4 ${
            vertical ? "flex-col" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
