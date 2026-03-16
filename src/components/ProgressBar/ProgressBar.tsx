import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type ProgressBarSize = "sm" | "lg";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: ProgressBarSize;
  label?: string;
  metadata?: string;
  showPercentage?: boolean;
}

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export function ProgressBar({
  value = 0,
  size = "lg",
  label,
  metadata,
  showPercentage = true,
  className,
  ...rest
}: ProgressBarProps) {
  const clamped = clampValue(value);

  return (
    <div className={cn("w-full", className)} {...rest}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-grey-900">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-grey-900">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className={cn("w-full rounded-full bg-grey-100", size === "lg" ? "h-3" : "h-2")}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "rounded-full bg-primary-400 transition-all duration-300",
            size === "lg" ? "h-3" : "h-2"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {metadata && (
        <div className="flex justify-end mt-1">
          <span className="text-sm text-grey-500">{metadata}</span>
        </div>
      )}
    </div>
  );
}
