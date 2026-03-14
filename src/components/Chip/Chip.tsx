import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "input" | "filter";
  icon?: ReactNode;
  disabled?: boolean;
  onClose?: () => void;
  onDropdown?: () => void;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = "input",
      icon,
      disabled = false,
      onClose,
      onDropdown,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-medium transition-colors",
          disabled
            ? "border-grey-200 bg-grey-100 text-grey-300 cursor-not-allowed"
            : "border-grey-300 bg-white text-grey-700 cursor-default focus-within:bg-[#FBF1F1] focus-within:border-primary-600",
          className
        )}
        {...rest}
      >
        {icon && <span className="shrink-0 size-4">{icon}</span>}
        <span>{children}</span>
        {variant === "input" && onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={disabled}
            className={cn(
              "shrink-0 size-4 inline-flex items-center justify-center rounded-sm",
              disabled
                ? "cursor-not-allowed text-grey-300"
                : "cursor-pointer text-grey-500 hover:text-grey-700"
            )}
            aria-label="Remove"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-3"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
        {variant === "filter" && (
          <button
            type="button"
            onClick={onDropdown}
            disabled={disabled}
            className={cn(
              "shrink-0 size-4 inline-flex items-center justify-center",
              disabled
                ? "cursor-not-allowed text-grey-300"
                : "cursor-pointer text-grey-500 hover:text-grey-700"
            )}
            aria-label="Open filter"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-3"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";
