import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type BadgeColor =
  | "orange"
  | "blue"
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "disabled";

export type BadgeType = "filled" | "accent" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  type?: BadgeType;
  size?: BadgeSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const colorStyles: Record<BadgeColor, Record<BadgeType, string>> = {
  orange: {
    filled: "bg-primary-400 text-white",
    accent: "bg-primary-50 text-primary-700",
    outline: "border border-primary-700 text-primary-700",
  },
  blue: {
    filled: "bg-secondary-400 text-white",
    accent: "bg-secondary-50 text-secondary-700",
    outline: "border border-secondary-700 text-secondary-700",
  },
  success: {
    filled: "bg-success-400 text-white",
    accent: "bg-success-50 text-[#036B26]",
    outline: "border border-[#036B26] text-[#036B26]",
  },
  warning: {
    filled: "bg-warning-400 text-black",
    accent: "bg-warning-50 text-warning-600",
    outline: "border border-warning-600 text-warning-600",
  },
  error: {
    filled: "bg-error-400 text-white",
    accent: "bg-error-50 text-[#9E0A05]",
    outline: "border border-[#9E0A05] text-[#9E0A05]",
  },
  neutral: {
    filled: "bg-grey-900 text-grey-50",
    accent: "bg-grey-100 text-grey-700",
    outline: "border border-grey-700 text-grey-700",
  },
  disabled: {
    filled: "bg-grey-300 text-grey-50",
    accent: "bg-grey-100 text-grey-400",
    outline: "border border-grey-400 text-grey-400",
  },
};

const sizeStyles: Record<BadgeSize, { container: string; icon: string }> = {
  sm: { container: "h-[22px] px-2 text-xs gap-1", icon: "size-3" },
  md: { container: "h-6 px-2.5 text-xs gap-1", icon: "size-3" },
  lg: { container: "h-7 px-3 text-sm gap-1.5", icon: "size-3.5" },
};

export function Badge({
  color = "orange",
  type = "filled",
  size = "sm",
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  const colorClass = colorStyles[color][type];
  const sizeConfig = sizeStyles[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl font-medium whitespace-nowrap",
        sizeConfig.container,
        colorClass,
        className
      )}
      {...rest}
    >
      {leadingIcon && (
        <span className={cn("shrink-0", sizeConfig.icon)}>{leadingIcon}</span>
      )}
      {children}
      {trailingIcon && (
        <span className={cn("shrink-0", sizeConfig.icon)}>{trailingIcon}</span>
      )}
    </span>
  );
}
