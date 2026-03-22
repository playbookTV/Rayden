import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";
import { useTabsContext } from "./Tabs";

export interface TabProps {
  value: string;
  icon?: ReactNode | IconName;
  badge?: number | string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/* ─── Size mappings ────────────────────────────────────────────────────── */

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const iconSize = { sm: "size-4", md: "size-5", lg: "size-6" } as const;
const iconResolveSize = { sm: "sm", md: "md", lg: "md" } as const;
const badgeText = { sm: "text-xs", md: "text-xs", lg: "text-sm" } as const;

const linePadding = {
  sm: "px-2 pt-1 pb-1.5",
  md: "px-3 pt-1.5 pb-2",
  lg: "px-4 pt-2 pb-2.5",
} as const;

const pillPadding = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
} as const;

const segmentedPadding = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
} as const;

export function Tab({ value, icon, badge, disabled = false, children, className }: TabProps) {
  const { activeValue, onSelect, variant, size, orientation, registerTab } = useTabsContext();
  const isActive = activeValue === value;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVertical = orientation === "vertical";

  useEffect(() => {
    registerTab(value, buttonRef.current);
    return () => registerTab(value, null);
  }, [value, registerTab]);

  const resolvedIcon = icon ? (
    <span className={cn("shrink-0", iconSize[size])}>
      {resolveIcon(icon, iconResolveSize[size] as "sm" | "md")}
    </span>
  ) : null;

  const badgeEl =
    badge !== undefined ? (
      <span
        className={cn(
          "inline-flex items-center justify-center px-1.5 rounded-full font-medium tracking-tight",
          badgeText[size],
          variant === "segmented" && isActive
            ? "bg-primary-500 text-white"
            : isActive
              ? "bg-primary-50 text-primary-500"
              : disabled
                ? "bg-grey-200 text-grey-400"
                : "bg-grey-100 text-grey-500"
        )}
      >
        {badge}
      </span>
    ) : null;

  /* ── Segmented ── */
  if (variant === "segmented") {
    return (
      <button
        ref={buttonRef}
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && onSelect(value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md overflow-hidden transition-colors cursor-pointer",
          segmentedPadding[size],
          textSize[size],
          isActive
            ? "bg-primary-50 text-grey-900"
            : disabled
              ? "text-grey-300 cursor-not-allowed"
              : "text-grey-500 hover:bg-grey-50",
          className
        )}
      >
        {resolvedIcon}
        <span className="font-normal leading-[1.45] whitespace-nowrap">{children}</span>
        {badgeEl}
      </button>
    );
  }

  /* ── Pill ── */
  if (variant === "pill") {
    return (
      <button
        ref={buttonRef}
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && onSelect(value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full transition-colors cursor-pointer",
          pillPadding[size],
          textSize[size],
          isActive
            ? "bg-primary-50 text-primary-400"
            : disabled
              ? "text-grey-300 cursor-not-allowed"
              : "text-grey-500 hover:bg-grey-50",
          className
        )}
      >
        {resolvedIcon}
        <span className="font-normal leading-[1.45] whitespace-nowrap">{children}</span>
        {badgeEl}
      </button>
    );
  }

  /* ── Line (default) ── */
  return (
    <button
      ref={buttonRef}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && onSelect(value)}
      className={cn(
        "relative inline-flex cursor-pointer",
        isVertical ? "flex-row" : "flex-col items-center",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <div className={cn("flex items-center gap-1.5", linePadding[size])}>
        {resolvedIcon}
        <span
          className={cn(
            "font-normal leading-[1.45] whitespace-nowrap transition-colors",
            textSize[size],
            isActive ? "text-grey-900" : disabled ? "text-grey-300" : "text-grey-500"
          )}
        >
          {children}
        </span>
        {badgeEl}
      </div>
      {/* Active indicator line */}
      {isVertical ? (
        <div
          className={cn(
            "w-0.5 self-stretch transition-colors",
            isActive ? "bg-primary-400" : "bg-grey-100"
          )}
        />
      ) : (
        <div
          className={cn(
            "h-0.5 w-full transition-colors",
            isActive ? "bg-primary-400" : "bg-grey-100"
          )}
        />
      )}
    </button>
  );
}
