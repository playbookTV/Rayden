import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type SpinnerType =
  | "thin"
  | "bold"
  | "duo-tone"
  | "buffering-thin"
  | "buffering-bold"
  | "dot"
  | "juggling";
export type SpinnerStyle = "brand" | "white";
export type SpinnerLabelPosition = "after" | "before" | "above" | "below";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner animation type */
  type?: SpinnerType;
  /** Spinner size */
  size?: SpinnerSize;
  /** Color style */
  colorStyle?: SpinnerStyle;
  /** Loading text */
  label?: string;
  /** Label position relative to spinner */
  labelPosition?: SpinnerLabelPosition;
}

/* ─── Size Config ──────────────────────────────────────────────────────── */

const sizeMap: Record<SpinnerSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
  "2xl": 56,
  "3xl": 64,
};

/* ─── Spinner SVGs ─────────────────────────────────────────────────────── */

function ThinSpinner({ size, color }: { size: number; color: string }) {
  const r = size / 2 - 2;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin">
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.2}
        className={color}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray={`${r * Math.PI * 0.75} ${r * Math.PI * 1.25}`}
        strokeLinecap="round"
        className={color}
      />
    </svg>
  );
}

function BoldSpinner({ size, color }: { size: number; color: string }) {
  const sw = Math.max(2.5, size * 0.1);
  const r = size / 2 - sw;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin">
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        opacity={0.2}
        className={color}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeDasharray={`${r * Math.PI * 0.75} ${r * Math.PI * 1.25}`}
        strokeLinecap="round"
        className={color}
      />
    </svg>
  );
}

function DuoToneSpinner({ size, color }: { size: number; color: string }) {
  const sw = Math.max(2, size * 0.08);
  const r = size / 2 - sw;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin">
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        opacity={0.15}
        className={color}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeDasharray={`${r * Math.PI} ${r * Math.PI}`}
        strokeLinecap="round"
        className={color}
      />
    </svg>
  );
}

function BufferingThinSpinner({ size, color }: { size: number; color: string }) {
  const r = size / 2 - 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.2}
        className={color}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className={cn(color, "animate-[spinner-dash_1.5s_ease-in-out_infinite]")}
        style={{ strokeDasharray: circumference, transformOrigin: "center" }}
      />
    </svg>
  );
}

function BufferingBoldSpinner({ size, color }: { size: number; color: string }) {
  const sw = Math.max(2.5, size * 0.1);
  const r = size / 2 - sw;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        opacity={0.2}
        className={color}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        className={cn(color, "animate-[spinner-dash_1.5s_ease-in-out_infinite]")}
        style={{ strokeDasharray: circumference, transformOrigin: "center" }}
      />
    </svg>
  );
}

function DotSpinner({ size, color }: { size: number; color: string }) {
  const dotSize = Math.max(3, size * 0.15);
  const c = size / 2;
  const r = size / 2 - dotSize;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = c + r * Math.cos(angle);
        const y = c + r * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={dotSize / 2}
            fill="currentColor"
            opacity={0.15 + (i / 8) * 0.85}
            className={color}
          />
        );
      })}
    </svg>
  );
}

function JugglingSpinner({ size, color }: { size: number; color: string }) {
  const dotSize = Math.max(3, size * 0.18);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0, 1, 2].map((i) => {
        const cx = size / 2 + (i - 1) * (size * 0.35);
        return (
          <circle
            key={i}
            cx={cx}
            cy={size / 2}
            r={dotSize / 2}
            fill="currentColor"
            className={cn(color, "animate-[juggle_1.4s_ease-in-out_infinite]")}
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Spinner Component ────────────────────────────────────────────────── */

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      type = "thin",
      size = "md",
      colorStyle = "brand",
      label,
      labelPosition = "after",
      className,
      ...rest
    },
    ref
  ) => {
    const px = sizeMap[size];
    const color = colorStyle === "brand" ? "text-primary-400" : "text-white";
    const labelColor = colorStyle === "brand" ? "text-grey-900" : "text-white";

    const spinnerEl = (() => {
      switch (type) {
        case "thin":
          return <ThinSpinner size={px} color={color} />;
        case "bold":
          return <BoldSpinner size={px} color={color} />;
        case "duo-tone":
          return <DuoToneSpinner size={px} color={color} />;
        case "buffering-thin":
          return <BufferingThinSpinner size={px} color={color} />;
        case "buffering-bold":
          return <BufferingBoldSpinner size={px} color={color} />;
        case "dot":
          return <DotSpinner size={px} color={color} />;
        case "juggling":
          return <JugglingSpinner size={px} color={color} />;
      }
    })();

    const isVertical = labelPosition === "above" || labelPosition === "below";
    const isReversed = labelPosition === "before" || labelPosition === "above";

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Loading"}
        className={cn(
          "inline-flex items-center gap-2",
          isVertical && "flex-col",
          isReversed && (isVertical ? "flex-col-reverse" : "flex-row-reverse"),
          className
        )}
        {...rest}
      >
        <div className="shrink-0" style={{ width: px, height: px }}>
          {spinnerEl}
        </div>
        {label && (
          <span className={cn("text-sm leading-[1.45] whitespace-nowrap", labelColor)}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
