import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export interface ButtonGroupItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: ReactNode | IconName;
  trailingIcon?: ReactNode | IconName;
  active?: boolean;
}

export const ButtonGroupItem = forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  (
    { leadingIcon, trailingIcon, active = false, disabled = false, className, children, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
          "border-y border-r border-grey-300",
          "first:rounded-l-lg first:border-l",
          "last:rounded-r-lg",
          active
            ? "bg-primary-400 text-white border-primary-400"
            : disabled
              ? "bg-white dark:bg-grey-50 text-grey-300 cursor-not-allowed"
              : "bg-white dark:bg-grey-50 text-grey-600 hover:bg-grey-100 cursor-pointer",
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
