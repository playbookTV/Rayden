import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type ProgressBarSize = "sm" | "md" | "lg";
export type ProgressBarType = "basic" | "segmented";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value from 0 to 100 */
  value?: number;
  /** Bar height: sm (4px), md (8px), lg (12px) */
  size?: ProgressBarSize;
  /** Bar type: basic (continuous) or segmented (10 discrete bars) */
  type?: ProgressBarType;
  /** Label text above the bar */
  label?: string;
  /** Metadata text(s) below the bar. Pass an array for dot-separated items. */
  metadata?: string | string[];
  /** Show percentage text */
  showPercentage?: boolean;
  /** Position of the percentage text */
  percentagePosition?: "top" | "bottom";
}

const SEGMENT_COUNT = 10;

const trackHeight: Record<ProgressBarSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export function ProgressBar({
  value = 0,
  size = "lg",
  type = "basic",
  label,
  metadata,
  showPercentage = true,
  percentagePosition = "bottom",
  className,
  ...rest
}: ProgressBarProps) {
  const clamped = clampValue(value);
  const filledSegments = Math.round((clamped / 100) * SEGMENT_COUNT);
  const metadataItems = Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)} {...rest}>
      {(label || (showPercentage && percentagePosition === "top")) && (
        <div className="flex items-center gap-2">
          {label && (
            <span className="flex-1 text-sm font-medium text-grey-900 leading-[1.45]">{label}</span>
          )}
          {showPercentage && percentagePosition === "top" && (
            <span className="text-sm font-semibold text-grey-500 leading-[1.45]">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      {type === "basic" ? (
        <div
          className={cn("w-full rounded-full bg-grey-200", trackHeight[size])}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              "rounded-full bg-primary-400 transition-all duration-300",
              trackHeight[size]
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
      ) : (
        <div
          className={cn("flex gap-0.5 w-full", trackHeight[size])}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-colors duration-300",
                i < filledSegments ? "bg-primary-400" : "bg-grey-100"
              )}
            />
          ))}
        </div>
      )}

      {(metadataItems.length > 0 || (showPercentage && percentagePosition === "bottom")) && (
        <div className="flex items-center justify-between">
          {metadataItems.length > 0 && (
            <div className="flex flex-1 items-center gap-1">
              {metadataItems.map((item, i) => (
                <span key={i} className="contents">
                  {i > 0 && <span className="text-xs text-grey-400 leading-[1.45]">•</span>}
                  <span className="text-sm font-medium text-grey-500 leading-[1.45]">{item}</span>
                </span>
              ))}
            </div>
          )}
          {showPercentage && percentagePosition === "bottom" && (
            <span className="flex-1 text-sm font-semibold text-grey-500 text-right leading-[1.45]">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
