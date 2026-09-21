import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "grey"
  | "destructive"
  | "text"
  | "success"
  | "warning"
  | "info";

export type ButtonAppearance = "solid" | "outlined";
export type ButtonSize = "sm" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  icon?: ReactNode | IconName;
  iconPosition?: "none" | "leading" | "trailing" | "icon-only";
}

const solidVariants: Record<ButtonVariant, string> = {
  primary: "bg-action-primary text-white hover:bg-action-primary-hover",
  secondary:
    "bg-transparent text-action-primary-text border-[1.5px] border-current hover:bg-primary-50",
  grey: "bg-action-grey text-white hover:bg-action-grey-hover",
  destructive: "bg-action-danger text-white hover:bg-action-danger-hover",
  text: "bg-transparent text-action-primary-text hover:underline underline-offset-4",
  success: "bg-action-success text-white hover:bg-action-success-hover",
  warning: "bg-action-warning text-white hover:bg-action-warning-hover",
  info: "bg-action-info text-white hover:bg-action-info-hover",
};

const outlinedVariants: Record<ButtonVariant, string> = {
  primary: solidVariants.secondary,
  secondary: solidVariants.secondary,
  grey: "bg-transparent text-grey-700 border-[1.5px] border-grey-500 hover:bg-grey-100",
  destructive:
    "bg-transparent text-action-danger-text border-[1.5px] border-current hover:bg-error-50",
  text: solidVariants.text,
  success: solidVariants.success,
  warning: solidVariants.warning,
  info: solidVariants.info,
};

const sizeClasses: Record<ButtonSize, Record<string, string>> = {
  sm: {
    base: "h-9 text-sm rounded-lg",
    none: "px-4 py-2",
    icon: "px-3 py-2",
    "icon-only": "p-2",
  },
  lg: {
    base: "h-14 text-base rounded-lg",
    none: "px-6 py-4",
    icon: "p-4",
    "icon-only": "p-4",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      appearance = "solid",
      size = "sm",
      icon,
      iconPosition = "none",
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const variantClasses =
      appearance === "outlined" ? outlinedVariants[variant] : solidVariants[variant];

    const sizeConfig = sizeClasses[size];
    const paddingKey =
      iconPosition === "icon-only" ? "icon-only" : iconPosition !== "none" ? "icon" : "none";

    const iconSizeClass = size === "sm" ? "size-5" : "size-6";
    const resolvedIcon = resolveIcon(icon, size === "sm" ? "md" : "lg");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          sizeConfig.base,
          sizeConfig[paddingKey],
          variantClasses,
          className
        )}
        {...rest}
      >
        {iconPosition === "leading" && resolvedIcon && (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        )}
        {iconPosition === "icon-only" && resolvedIcon ? (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        ) : (
          iconPosition !== "icon-only" && children
        )}
        {iconPosition === "trailing" && resolvedIcon && (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
