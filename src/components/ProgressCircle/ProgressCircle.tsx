import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export type ProgressCircleSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: ProgressCircleSize;
  showText?: boolean;
}

const sizeConfig: Record<
  ProgressCircleSize,
  { dimension: number; strokeWidth: number; fontSize: number }
> = {
  xs: { dimension: 48, strokeWidth: 4, fontSize: 12 },
  sm: { dimension: 56, strokeWidth: 5, fontSize: 12 },
  md: { dimension: 72, strokeWidth: 6, fontSize: 14 },
  lg: { dimension: 90, strokeWidth: 7, fontSize: 16 },
  xl: { dimension: 120, strokeWidth: 8, fontSize: 18 },
};

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export function ProgressCircle({
  value = 0,
  size = "md",
  showText = true,
  className,
  ...rest
}: ProgressCircleProps) {
  const clamped = clampValue(value);
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: config.dimension, height: config.dimension }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <svg
        width={config.dimension}
        height={config.dimension}
        className="-rotate-90"
      >
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="#F0F2F5"
          strokeWidth={config.strokeWidth}
        />
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="#F56630"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      {showText && (
        <span
          className="absolute font-semibold text-black"
          style={{ fontSize: config.fontSize }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
