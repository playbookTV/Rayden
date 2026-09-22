import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconSource } from "../Icon";

export interface ButtonGroupItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: IconSource;
  trailingIcon?: IconSource;
  /** Selected state. Exposed as aria-pressed so it is not colour-only. */
  active?: boolean;
}

export const ButtonGroupItem = forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  (
    {
      leadingIcon,
      trailingIcon,
      active = false,
      disabled = false,
      className,
      children,
      type = "button",
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
          "border-y border-r border-control-border",
          "first:rounded-l-lg first:border-l",
          "last:rounded-r-lg",
          active
            ? "bg-action-primary text-white border-action-primary"
            : disabled
              ? "bg-surface text-grey-300 cursor-not-allowed"
              : "bg-surface text-on-surface-secondary hover:bg-grey-100 cursor-pointer",
          className
        )}
        {...rest}
      >
        {leadingIcon && <span className="shrink-0 size-5">{resolveIcon(leadingIcon, "md")}</span>}
        {children}
        {trailingIcon && <span className="shrink-0 size-5">{resolveIcon(trailingIcon, "md")}</span>}
      </button>
    );
  }
);

ButtonGroupItem.displayName = "ButtonGroupItem";
