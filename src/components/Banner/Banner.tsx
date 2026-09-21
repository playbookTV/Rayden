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
  /**
   * Show the dismiss control. Defaults to true only when `onDismiss` is supplied —
   * a close button with no handler used to render and do nothing. Set it explicitly
   * to force the control on or off.
   */
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
    bold: { bg: "bg-action-info", divider: "bg-secondary-50" },
    subtle: {
      bg: "bg-secondary-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-secondary-500",
    },
  },
  success: {
    bold: { bg: "bg-action-success", divider: "bg-success-50" },
    subtle: {
      bg: "bg-success-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-success-400",
    },
  },
  error: {
    bold: { bg: "bg-action-danger", divider: "bg-error-50" },
    subtle: {
      bg: "bg-error-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-error-400",
    },
  },
  warning: {
    bold: { bg: "bg-action-warning", divider: "bg-warning-50" },
    subtle: {
      bg: "bg-warning-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-warning-700",
    },
  },
  feature: {
    bold: { bg: "bg-[#101928]", divider: "bg-grey-100" },
    subtle: {
      bg: "bg-grey-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-grey-300",
    },
  },
  opportunity: {
    bold: { bg: "bg-[#475ccc]", divider: "bg-secondary-50" },
    subtle: {
      bg: "bg-secondary-50",
      text: "text-grey-900",
      descText: "text-grey-600",
      divider: "bg-secondary-500",
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
      dismissible,
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
          "flex items-center justify-between gap-3 overflow-hidden rounded-[4px] w-full",
          colorSet.bg,
          size === "sm" ? "min-h-10 px-3 py-2" : "min-h-12 px-8 py-3",
          className
        )}
        {...rest}
      >
        {/* Content */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-wrap items-center gap-y-1",
            size === "sm" ? "gap-x-2" : "gap-x-3"
          )}
        >
          {/* Icon */}
          {icon ? (
            <span className={cn("shrink-0", iconSize, textColor)}>
              {resolveIcon(icon, size === "sm" ? "sm" : "md")}
            </span>
          ) : (
            <InfoIcon className={cn("shrink-0", iconSize, textColor)} />
          )}

          {/* Text */}
          <span className={cn("min-w-0 font-semibold leading-[1.45]", textSize, textColor)}>
            {title}
          </span>

          {description && (
            <span className={cn("min-w-0 leading-[1.45] hidden sm:inline", textSize, descColor)}>
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
        {(dismissible ?? !!onDismiss) && (
          <div className="flex items-center gap-3 self-stretch shrink-0">
            <div className={cn("w-px self-stretch", colorSet.divider)} />
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss banner"
              className={cn("shrink-0 box-content p-1 -m-1 cursor-pointer", iconSize, textColor)}
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
