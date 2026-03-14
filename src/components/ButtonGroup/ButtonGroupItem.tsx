import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface ButtonGroupItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  active?: boolean;
}

export const ButtonGroupItem = forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(
  (
    {
      leadingIcon,
      trailingIcon,
      active = false,
      disabled = false,
      className,
      children,
      ...rest
    },
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
              ? "bg-white text-grey-300 cursor-not-allowed"
              : "bg-white text-grey-600 hover:bg-grey-100 cursor-pointer",
          className
        )}
        {...rest}
      >
        {leadingIcon && <span className="shrink-0 size-5">{leadingIcon}</span>}
        {children}
        {trailingIcon && (
          <span className="shrink-0 size-5">{trailingIcon}</span>
        )}
      </button>
    );
  }
);

ButtonGroupItem.displayName = "ButtonGroupItem";
