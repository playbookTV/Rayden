import { type ReactNode } from "react";
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

export function Tab({
  value,
  icon,
  badge,
  disabled = false,
  children,
  className,
}: TabProps) {
  const { activeValue, onSelect, variant } = useTabsContext();
  const isActive = activeValue === value;

  if (variant === "pill") {
    return (
      <button
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => !disabled && onSelect(value)}
        className={cn(
          "inline-flex items-center gap-2 h-9 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-primary-50 text-primary-400"
            : disabled
              ? "border border-grey-300 text-grey-300 cursor-not-allowed"
              : "border border-grey-300 text-grey-700 hover:bg-grey-50",
          className
        )}
      >
        {icon && <span className="shrink-0 size-4">{resolveIcon(icon, "sm")}</span>}
        {children}
        {badge !== undefined && (
          <span
            className={cn(
              "inline-flex items-center justify-center px-2 rounded-full text-xs font-medium tracking-tight",
              isActive
                ? "bg-primary-400 text-white"
                : disabled
                  ? "bg-grey-200 text-grey-50"
                  : "bg-grey-100 text-grey-700"
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Line variant
  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onSelect(value)}
      className={cn(
        "relative inline-flex flex-col items-center cursor-pointer",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-[15px]">
        {icon && <span className="shrink-0 size-5">{resolveIcon(icon, "md")}</span>}
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            isActive
              ? "text-primary-400"
              : disabled
                ? "text-grey-300"
                : "text-grey-700 hover:text-grey-700"
          )}
        >
          {children}
        </span>
        {badge !== undefined && (
          <span
            className={cn(
              "inline-flex items-center justify-center px-2 rounded-full text-xs font-medium tracking-tight",
              isActive
                ? "bg-primary-400 text-white"
                : disabled
                  ? "bg-grey-200 text-grey-50"
                  : "bg-grey-100 text-grey-700"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <div
        className={cn(
          "h-px w-full transition-colors",
          isActive
            ? "bg-primary-400"
            : disabled
              ? "bg-grey-200"
              : "bg-grey-200 group-hover:bg-grey-500"
        )}
      />
    </button>
  );
}
