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

const solidVariants: Record<string, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-400 focus-visible:bg-primary-700 disabled:bg-grey-300 disabled:text-white dark:disabled:bg-grey-200",
  secondary:
    "bg-white dark:bg-grey-50 text-primary-600 border-[1.5px] border-primary-600 hover:bg-primary-50 hover:border-primary-600 focus-visible:bg-primary-50 focus-visible:border-primary-700 focus-visible:border-2 disabled:bg-white dark:disabled:bg-grey-50 disabled:border-2 disabled:border-grey-100 disabled:text-grey-400",
  grey: "bg-grey-600 text-white hover:bg-grey-500 focus-visible:bg-grey-700 disabled:bg-grey-300 disabled:text-white dark:disabled:bg-grey-200",
  destructive:
    "bg-error-500 text-white hover:bg-error-200 focus-visible:bg-error-500 disabled:bg-grey-300 disabled:text-white dark:disabled:bg-grey-200",
  text: "bg-transparent text-primary-600 hover:text-primary-400 focus-visible:text-primary-700 disabled:text-grey-400",
  success: "bg-success-500 text-white hover:bg-success-200 focus-visible:bg-success-600",
  warning: "bg-warning-400 text-white hover:bg-warning-500 focus-visible:bg-warning-500",
  info: "bg-info-400 text-white hover:bg-info-500 focus-visible:bg-info-500",
};

const outlinedVariants: Record<string, string> = {
  primary: solidVariants.secondary!,
  secondary: solidVariants.secondary!,
  grey: "bg-white dark:bg-grey-50 text-grey-600 border-[1.5px] border-grey-300 hover:bg-grey-100 hover:border-grey-300 focus-visible:bg-grey-100 focus-visible:border-grey-700 focus-visible:border-2 disabled:bg-white dark:disabled:bg-grey-50 disabled:border-2 disabled:border-grey-100 disabled:text-grey-400",
  destructive:
    "bg-white dark:bg-grey-50 text-error-500 border-[1.5px] border-error-200 hover:bg-error-100/20 hover:border-error-200 focus-visible:bg-error-100/20 focus-visible:border-error-500 focus-visible:border-2 disabled:bg-white dark:disabled:bg-grey-50 disabled:border-2 disabled:border-grey-100 disabled:text-grey-400",
  text: solidVariants.text!,
  success: solidVariants.success!,
  warning: solidVariants.warning!,
  info: solidVariants.info!,
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
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed",
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
