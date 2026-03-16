import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type DividerVariant =
  | "default"
  | "with-icon"
  | "with-label"
  | "with-title"
  | "with-button"
  | "with-title-and-button";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant;
  label?: string;
  icon?: ReactNode | IconName;
  buttonLabel?: string;
  buttonIcon?: ReactNode | IconName;
  onButtonClick?: () => void;
}

function DividerLine({ className }: { className?: string }) {
  return <div className={cn("h-px flex-1 bg-grey-100", className)} />;
}

function DividerButton({
  label,
  icon,
  onClick,
}: {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-grey-300 bg-white dark:bg-grey-50 px-3 py-2 text-sm font-semibold text-grey-700 cursor-pointer hover:bg-grey-50"
    >
      {icon && <span className="size-5 shrink-0">{resolveIcon(icon, "md")}</span>}
      {label && <span>{label}</span>}
    </button>
  );
}

export function Divider({
  variant = "default",
  label,
  icon,
  buttonLabel,
  buttonIcon,
  onButtonClick,
  className,
  ...rest
}: DividerProps) {
  if (variant === "default") {
    return <div className={cn("h-px w-full bg-grey-100", className)} {...rest} />;
  }

  if (variant === "with-icon") {
    return (
      <div className={cn("relative w-full", className)} {...rest}>
        <DividerLine />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-grey-50 px-1 py-0.5 flex items-center justify-center">
          <span className="size-6">{resolveIcon(icon, "lg")}</span>
        </div>
      </div>
    );
  }

  if (variant === "with-label") {
    return (
      <div className={cn("flex items-center gap-0.5 w-full", className)} {...rest}>
        <span className="shrink-0 pr-2 text-sm text-grey-400 bg-white dark:bg-grey-50">
          {label}
        </span>
        <DividerLine />
      </div>
    );
  }

  if (variant === "with-title") {
    return (
      <div className={cn("relative w-full", className)} {...rest}>
        <DividerLine />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-grey-50 px-2">
          <span className="text-lg text-grey-900 whitespace-nowrap">{label}</span>
        </div>
      </div>
    );
  }

  if (variant === "with-button") {
    return (
      <div className={cn("relative w-full", className)} {...rest}>
        <DividerLine />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <DividerButton label={buttonLabel} icon={buttonIcon} onClick={onButtonClick} />
        </div>
      </div>
    );
  }

  // with-title-and-button
  return (
    <div className={cn("flex items-center w-full", className)} {...rest}>
      <div className="shrink-0 bg-white dark:bg-grey-50 px-2">
        <span className="text-lg text-grey-900 whitespace-nowrap">{label}</span>
      </div>
      <DividerLine />
      <div className="shrink-0">
        <DividerButton label={buttonLabel} icon={buttonIcon} onClick={onButtonClick} />
      </div>
    </div>
  );
}
