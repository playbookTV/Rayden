import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type BannerStatus =
  | "information"
  | "success"
  | "error"
  | "warning"
  | "feature"
  | "opportunity";

export type BannerEmphasis = "bold" | "subtle";
export type BannerSize = "sm" | "lg";

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Status determines the color scheme */
  status?: BannerStatus;
  /** Bold uses a solid background with white text; subtle uses a light tinted background */
  emphasis?: BannerEmphasis;
  /** sm (40px) or lg (48px) */
  size?: BannerSize;
  /** Headline text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional leading icon */
  icon?: ReactNode | IconName;
  /** Optional action button label */
  buttonLabel?: string;
  /** Called when the action button is clicked */
  onButtonClick?: () => void;
  /** Show the close button */
  dismissible?: boolean;
  /** Called when the close button is clicked */
  onDismiss?: () => void;
}

/* ─── Color config ─────────────────────────────────────────────────────── */

interface StatusColors {
  bold: { bg: string; divider: string };
  subtle: { bg: string; text: string; descText: string; divider: string };
}

const statusColors: Record<BannerStatus, StatusColors> = {
  information: {
    bold: { bg: "bg-[#4a9fed]", divider: "bg-[#f0f7ff]" },
    subtle: {
      bg: "bg-[#f0f7ff]",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-[#0063ad]",
    },
  },
  success: {
    bold: { bg: "bg-success-400", divider: "bg-success-50" },
    subtle: {
      bg: "bg-success-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-success-400",
    },
  },
  error: {
    bold: { bg: "bg-error-400", divider: "bg-error-50" },
    subtle: {
      bg: "bg-error-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-error-400",
    },
  },
  warning: {
    bold: { bg: "bg-warning-400", divider: "bg-warning-50" },
    subtle: {
      bg: "bg-warning-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-warning-700",
    },
  },
  feature: {
    bold: { bg: "bg-grey-900", divider: "bg-grey-100" },
    subtle: {
      bg: "bg-grey-50",
      text: "text-black",
      descText: "text-black",
      divider: "bg-grey-300",
    },
  },
  opportunity: {
    bold: { bg: "bg-[#475ccc]", divider: "bg-[#b1bae9]" },
    subtle: {
      bg: "bg-[#f7f8fd]",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-[#b1bae9]",
    },
  },
};

/* ─── Icons ────────────────────────────────────────────────────────────── */

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ─── Banner ───────────────────────────────────────────────────────────── */

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      status = "information",
      emphasis = "subtle",
      size = "lg",
      title,
      description,
      icon,
      buttonLabel,
      onButtonClick,
      dismissible = true,
      onDismiss,
      className,
      ...rest
    },
    ref
  ) => {
    const colors = statusColors[status];
    const isBold = emphasis === "bold";
    const colorSet = isBold ? colors.bold : colors.subtle;

    const textColor = isBold ? "text-white" : (colorSet as StatusColors["subtle"]).text;
    const descColor = isBold ? "text-white" : (colorSet as StatusColors["subtle"]).descText;
    const buttonColor = isBold ? "text-white" : "text-grey-600";

    const iconSize = size === "sm" ? "size-4" : "size-6";
    const textSize = size === "sm" ? "text-xs" : "text-sm";

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex items-center justify-between overflow-hidden rounded-[4px] w-full",
          colorSet.bg,
          size === "sm" ? "h-10 px-3 py-2" : "h-12 px-8 py-3",
          className
        )}
        {...rest}
      >
        {/* Content */}
        <div className={cn("flex flex-1 items-center", size === "sm" ? "gap-2" : "gap-3")}>
          {/* Icon */}
          {icon ? (
            <span className={cn("shrink-0", iconSize, textColor)}>
              {resolveIcon(icon, size === "sm" ? "sm" : "md")}
            </span>
          ) : (
            <InfoIcon className={cn("shrink-0", iconSize, textColor)} />
          )}

          {/* Text */}
          <span
            className={cn("font-semibold leading-[1.45] sm:whitespace-nowrap", textSize, textColor)}
          >
            {title}
          </span>

          {description && (
            <span
              className={cn(
                "leading-[1.45] sm:whitespace-nowrap hidden sm:inline",
                textSize,
                descColor
              )}
            >
              {description}
            </span>
          )}

          {/* Action button */}
          {buttonLabel && (
            <button
              type="button"
              onClick={onButtonClick}
              className={cn(
                "shrink-0 font-semibold leading-[1.45] whitespace-nowrap cursor-pointer",
                textSize,
                buttonColor,
                isBold && "text-white underline"
              )}
            >
              {buttonLabel}
            </button>
          )}
        </div>

        {/* Close section */}
        {dismissible && (
          <div className="flex items-center gap-3 self-stretch shrink-0">
            <div className={cn("w-px self-stretch", colorSet.divider)} />
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss banner"
              className={cn("shrink-0 cursor-pointer", iconSize, textColor)}
            >
              <CloseIcon className="size-full" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

Banner.displayName = "Banner";
