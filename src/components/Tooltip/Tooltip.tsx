import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";

export type TooltipPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

export type TooltipTheme = "light" | "dark";

export interface TooltipAction {
  label: string;
  onClick: () => void;
}

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  theme?: TooltipTheme;
  position?: TooltipPosition;
  title?: string;
  content: string;
  onClose?: () => void;
  primaryAction?: TooltipAction;
  secondaryAction?: TooltipAction;
}

function Arrow({ position, theme }: { position: TooltipPosition; theme: TooltipTheme }) {
  const fill = theme === "dark" ? "#101928" : "#FFFFFF";
  const stroke = theme === "light" ? "#F0F2F5" : "none";

  const isTop = position.startsWith("top");
  const isBottom = position.startsWith("bottom");
  const isLeft = position.startsWith("left");
  const isRight = position.startsWith("right");

  if (isTop || isBottom) {
    const alignment = position.endsWith("left")
      ? "justify-start pl-4"
      : position.endsWith("right")
        ? "justify-end pr-4"
        : "justify-center";

    return (
      <div className={cn("flex w-full", alignment)}>
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          className={isBottom ? "rotate-180" : ""}
        >
          <path d="M10 0L20 12H0L10 0Z" fill={fill} stroke={stroke} />
        </svg>
      </div>
    );
  }

  const alignment = position.endsWith("top")
    ? "justify-start pt-4"
    : position.endsWith("bottom")
      ? "justify-end pb-4"
      : "justify-center";

  return (
    <div className={cn("flex flex-col self-stretch", alignment)}>
      <svg
        width="12"
        height="20"
        viewBox="0 0 12 20"
        fill="none"
        className={isRight ? "rotate-180" : ""}
      >
        <path d="M0 10L12 0V20L0 10Z" fill={fill} stroke={stroke} />
      </svg>
    </div>
  );
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      theme = "light",
      position = "top-left",
      title,
      content,
      onClose,
      primaryAction,
      secondaryAction,
      className,
      ...rest
    },
    ref
  ) => {
    const isDark = theme === "dark";
    const isHorizontal = position.startsWith("left") || position.startsWith("right");
    const showArrowBefore = position.startsWith("top") || position.startsWith("left");
    const showArrowAfter = position.startsWith("bottom") || position.startsWith("right");

    return (
      <div
        ref={ref}
        className={cn("inline-flex isolate", isHorizontal ? "flex-row" : "flex-col", className)}
        {...rest}
      >
        {showArrowBefore && (
          <div className="relative z-[2] -mb-px">
            <Arrow position={position} theme={theme} />
          </div>
        )}

        <div
          role="tooltip"
          className={cn(
            "flex flex-col gap-4 rounded-lg p-4 relative z-[1]",
            isDark ? "bg-grey-900" : "bg-white dark:bg-grey-50 border border-grey-100"
          )}
        >
          <div className="flex gap-2 items-start">
            <div className="flex-1 flex flex-col gap-1 text-sm">
              {title && (
                <p className={cn("font-semibold", isDark ? "text-white" : "text-grey-800")}>
                  {title}
                </p>
              )}
              <p className={isDark ? "text-grey-300" : "text-grey-500"}>{content}</p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "shrink-0 cursor-pointer",
                  isDark ? "text-grey-300 hover:text-white" : "text-grey-500 hover:text-grey-700"
                )}
                aria-label="Close"
              >
                <Icon name="multiply" size="md" />
              </button>
            )}
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex items-center justify-between">
              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className={cn(
                    "text-sm font-semibold cursor-pointer",
                    isDark ? "text-grey-50" : "text-grey-500"
                  )}
                >
                  {secondaryAction.label}
                </button>
              )}
              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className={cn(
                    "text-sm font-semibold cursor-pointer",
                    isDark ? "text-primary-400" : "text-primary-500"
                  )}
                >
                  {primaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>

        {showArrowAfter && (
          <div className="relative z-[2] -mt-px">
            <Arrow position={position} theme={theme} />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
