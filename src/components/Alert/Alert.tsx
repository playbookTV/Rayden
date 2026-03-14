import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type AlertVariant = "toast" | "banner";
export type AlertState = "information" | "success" | "warning" | "error";

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  state?: AlertState;
  title?: string;
  description?: string;
  icon?: ReactNode;
  showIcon?: boolean;
  onClose?: () => void;
  primaryAction?: AlertAction;
  secondaryAction?: AlertAction;
}

const stateStyles: Record<
  AlertState,
  {
    border: string;
    iconBg: string;
    iconBorder: string;
    ctaBg: string;
    ctaText: string;
  }
> = {
  information: {
    border: "bg-secondary-500",
    iconBg: "bg-secondary-50",
    iconBorder: "border-secondary-75",
    ctaBg: "bg-secondary-500",
    ctaText: "text-white",
  },
  success: {
    border: "bg-success-600",
    iconBg: "bg-success-50",
    iconBorder: "border-success-75",
    ctaBg: "bg-success-600",
    ctaText: "text-white",
  },
  warning: {
    border: "bg-warning-500",
    iconBg: "bg-warning-50",
    iconBorder: "border-warning-75",
    ctaBg: "bg-warning-400",
    ctaText: "text-black",
  },
  error: {
    border: "bg-error-500",
    iconBg: "bg-error-50",
    iconBorder: "border-error-75",
    ctaBg: "bg-error-500",
    ctaText: "text-white",
  },
};

export function Alert({
  variant = "toast",
  state = "information",
  title,
  description,
  icon,
  showIcon = true,
  onClose,
  primaryAction,
  secondaryAction,
  className,
  ...rest
}: AlertProps) {
  const styles = stateStyles[state];
  const isBanner = variant === "banner";

  return (
    <div
      className={cn(
        "flex items-start overflow-hidden rounded bg-white",
        className
      )}
      role="alert"
      {...rest}
    >
      {/* Left color streak */}
      <div className={cn("w-1.5 self-stretch shrink-0", styles.border)} />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 items-start border-t border-r border-b border-grey-200 rounded-r",
          isBanner ? "gap-4 p-5" : "gap-3 px-4 py-3"
        )}
      >
        {/* Icon */}
        {showIcon && icon && (
          <div
            className={cn(
              "shrink-0 rounded-lg border flex items-center justify-center",
              styles.iconBg,
              styles.iconBorder,
              isBanner ? "size-8" : "size-6"
            )}
          >
            <span className={isBanner ? "size-4" : "size-3"}>{icon}</span>
          </div>
        )}

        {/* Text content */}
        {isBanner ? (
          <div className="flex flex-1 flex-col gap-4 justify-center">
            <div className="flex flex-col gap-1">
              {title && (
                <p className="text-base font-semibold text-grey-900">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-sm text-grey-600">{description}</p>
              )}
            </div>
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap items-center gap-2">
                {primaryAction && (
                  <button
                    type="button"
                    onClick={primaryAction.onClick}
                    className={cn(
                      "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer",
                      styles.ctaBg,
                      styles.ctaText
                    )}
                  >
                    {primaryAction.label}
                  </button>
                )}
                {secondaryAction && (
                  <button
                    type="button"
                    onClick={secondaryAction.onClick}
                    className="inline-flex items-center justify-center rounded-lg border border-grey-300 bg-white px-4 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-0.5 self-stretch text-sm">
            {title && (
              <p className="font-semibold text-grey-900">{title}</p>
            )}
            {description && (
              <p className="text-grey-600">{description}</p>
            )}
          </div>
        )}

        {/* Close button with divider */}
        {onClose && (
          <div
            className={cn(
              "flex items-center self-stretch shrink-0",
              isBanner ? "gap-4" : "gap-3"
            )}
          >
            <div className="w-px self-stretch bg-grey-100" />
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center text-grey-500 hover:text-grey-700 cursor-pointer"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-5"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
