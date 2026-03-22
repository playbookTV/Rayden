import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type BreadcrumbSeparator = "chevron" | "double-chevron" | "slash";

export interface BreadcrumbItem {
  /** Display label (use "..." for truncated items) */
  label: string;
  href?: string;
  icon?: ReactNode | IconName;
  disabled?: boolean;
  active?: boolean;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Separator style between items */
  separator?: BreadcrumbSeparator;
  /** Show top and bottom borders */
  hasBorders?: boolean;
}

/* ─── Separator Icons ──────────────────────────────────────────────────── */

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

function DoubleChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 5l5 5-5 5M10.5 5l5 5-5 5" />
    </svg>
  );
}

function SeparatorElement({ type }: { type: BreadcrumbSeparator }) {
  switch (type) {
    case "chevron":
      return <ChevronRight className="size-5 text-grey-300" />;
    case "double-chevron":
      return <DoubleChevronRight className="size-5 text-grey-300" />;
    case "slash":
      return <span className="text-sm font-medium text-grey-300 w-4 text-center">/</span>;
  }
}

/* ─── Breadcrumb ───────────────────────────────────────────────────────── */

export function Breadcrumb({
  items,
  separator = "chevron",
  hasBorders = false,
  className,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("py-2.5", hasBorders && "border-y border-grey-100", className)}
      {...rest}
    >
      <ol className="flex items-center gap-4 text-sm font-medium">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-4">
            {i > 0 && (
              <span aria-hidden>
                <SeparatorElement type={separator} />
              </span>
            )}
            <span className="flex items-center gap-2">
              {item.icon && (
                <span
                  className={cn(
                    "size-5 shrink-0",
                    item.active
                      ? "text-primary-400"
                      : item.disabled
                        ? "text-grey-300"
                        : "text-grey-500 group-hover:text-grey-700"
                  )}
                >
                  {resolveIcon(item.icon, "sm")}
                </span>
              )}
              {item.href && !item.disabled && !item.active ? (
                <a
                  href={item.href}
                  className="text-grey-500 hover:text-grey-700 hover:underline transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    item.active && "text-primary-400",
                    item.disabled && "text-grey-300 cursor-not-allowed",
                    !item.active && !item.disabled && "text-grey-500"
                  )}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
