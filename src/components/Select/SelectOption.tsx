import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";
import { useSelectContext } from "./Select";

export interface SelectOptionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Unique value for this option */
  value: string;
  /** Leading icon — accepts a ReactNode or IconName string */
  icon?: ReactNode | IconName;
  /** Leading avatar element (e.g., <Avatar />) */
  avatar?: ReactNode;
  /** Status dot color (CSS color string, e.g., "#04802E") */
  statusColor?: string;
  /** Supporting text shown after the label */
  description?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export const SelectOption = forwardRef<HTMLButtonElement, SelectOptionProps>(
  (
    {
      value,
      icon,
      avatar,
      statusColor,
      description,
      disabled = false,
      children,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    const ctx = useSelectContext();
    const isSelected = ctx.value === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      ctx.onSelect(value);
    };

    const resolvedIcon = resolveIcon(icon, "md");

    // Determine leading element
    const leading = avatar ? (
      <span className="shrink-0 size-5">{avatar}</span>
    ) : statusColor ? (
      <span
        className="shrink-0 size-2 rounded-full border-[1.5px] border-white"
        style={{ backgroundColor: statusColor }}
      />
    ) : resolvedIcon ? (
      <span className={cn("shrink-0 size-5", disabled && "opacity-50")}>{resolvedIcon}</span>
    ) : null;

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={isSelected}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex w-full items-center px-4 py-2 text-left text-body-sm outline-none transition-colors",
          statusColor ? "gap-2" : "gap-3",
          disabled
            ? "bg-grey-100 text-grey-400 cursor-not-allowed"
            : "text-grey-900 hover:bg-grey-50 focus:bg-grey-100 focus:font-medium",
          className
        )}
        {...rest}
      >
        <div className={cn("flex flex-1 items-center", statusColor ? "gap-2" : "gap-3")}>
          {leading}
          <span className="shrink-0">{children}</span>
          {description && <span className="text-grey-500 truncate">{description}</span>}
        </div>

        {isSelected && !disabled && (
          <span className="ml-2 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#1671D9]">
              <circle cx="8" cy="8" r="8" fill="currentColor" />
              <path
                d="M11.5 5.5L6.5 10.5L4.5 8.5"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

SelectOption.displayName = "SelectOption";
