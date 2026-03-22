import { forwardRef, useCallback, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current value (0–100) */
  value?: number;
  /** Called when value changes */
  onChange?: (value: number) => void;
  /** Track/handle size */
  size?: SliderSize;
  /** Label above the slider */
  label?: string;
  /** Metadata text(s) below the slider */
  metadata?: string | string[];
  /** Show percentage text */
  showPercentage?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
}

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current range [low, high] (0–100) */
  value?: [number, number];
  /** Called when range changes */
  onChange?: (value: [number, number]) => void;
  /** Track/handle size */
  size?: SliderSize;
  /** Label above the slider */
  label?: string;
  /** Show min/max labels below */
  showLabels?: boolean;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
}

/* ─── Size Config ──────────────────────────────────────────────────────── */

interface SizeConfig {
  track: string;
  handle: string;
  handleSize: number;
  border: string;
}

const sizeConfig: Record<SliderSize, SizeConfig> = {
  sm: { track: "h-1", handle: "size-3.5", handleSize: 14, border: "border-[2.333px]" },
  md: { track: "h-2", handle: "size-4", handleSize: 16, border: "border-[2.667px]" },
  lg: { track: "h-3", handle: "size-5", handleSize: 20, border: "border-[3.333px]" },
};

/* ─── Utilities ────────────────────────────────────────────────────────── */

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function getPercent(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100;
}

function getValueFromPosition(
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number
) {
  const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
  const raw = min + pct * (max - min);
  const stepped = Math.round(raw / step) * step;
  return clamp(stepped, min, max);
}

/* ─── Slider ───────────────────────────────────────────────────────────── */

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      onChange,
      size = "lg",
      label,
      metadata,
      showPercentage = true,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState(0);
    const val = controlledValue ?? uncontrolled;
    const trackRef = useRef<HTMLDivElement>(null);
    const config = sizeConfig[size];
    const pct = getPercent(val, min, max);
    const metaItems = Array.isArray(metadata) ? metadata : metadata ? [metadata] : [];

    const updateValue = useCallback(
      (clientX: number) => {
        if (disabled || !trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const v = getValueFromPosition(clientX, rect, min, max, step);
        if (controlledValue === undefined) setUncontrolled(v);
        onChange?.(v);
      },
      [disabled, min, max, step, controlledValue, onChange]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updateValue(e.clientX);
      },
      [disabled, updateValue]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !e.buttons) return;
        updateValue(e.clientX);
      },
      [disabled, updateValue]
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 w-full", disabled && "opacity-50", className)}
        {...rest}
      >
        {label && <span className="text-sm font-medium text-grey-900 leading-[1.45]">{label}</span>}
        <div
          ref={trackRef}
          className={cn(
            "relative w-full rounded-full bg-grey-200 cursor-pointer",
            config.track,
            disabled && "cursor-not-allowed"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          role="slider"
          aria-valuenow={val}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Filled track */}
          <div
            className={cn("absolute left-0 top-0 rounded-full bg-primary-400", config.track)}
            style={{ width: `${pct}%` }}
          />
          {/* Handle */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full bg-primary-500 border-white border-solid shadow-sm",
              config.handle,
              config.border
            )}
            style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>
        {(metaItems.length > 0 || showPercentage) && (
          <div className="flex items-center justify-between">
            {metaItems.length > 0 && (
              <div className="flex flex-1 items-center gap-1">
                {metaItems.map((item, i) => (
                  <span key={i} className="contents">
                    {i > 0 && <span className="text-xs text-grey-400">•</span>}
                    <span className="text-sm font-medium text-grey-500 leading-[1.45]">{item}</span>
                  </span>
                ))}
              </div>
            )}
            {showPercentage && (
              <span className="flex-1 text-sm font-semibold text-grey-500 text-right leading-[1.45]">
                {Math.round(pct)}%
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";

/* ─── RangeSlider ──────────────────────────────────────────────────────── */

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      value: controlledValue,
      onChange,
      size = "lg",
      label,
      showLabels = true,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState<[number, number]>([25, 75]);
    const val = controlledValue ?? uncontrolled;
    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<"low" | "high" | null>(null);
    const config = sizeConfig[size];

    const lowPct = getPercent(val[0], min, max);
    const highPct = getPercent(val[1], min, max);

    const update = useCallback(
      (newVal: [number, number]) => {
        if (controlledValue === undefined) setUncontrolled(newVal);
        onChange?.(newVal);
      },
      [controlledValue, onChange]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !trackRef.current) return;
        e.preventDefault();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const rect = trackRef.current.getBoundingClientRect();
        const v = getValueFromPosition(e.clientX, rect, min, max, step);
        const distLow = Math.abs(v - val[0]);
        const distHigh = Math.abs(v - val[1]);
        dragging.current = distLow <= distHigh ? "low" : "high";
        if (dragging.current === "low") {
          update([clamp(v, min, val[1]), val[1]]);
        } else {
          update([val[0], clamp(v, val[0], max)]);
        }
      },
      [disabled, min, max, step, val, update]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || !e.buttons || !trackRef.current || !dragging.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const v = getValueFromPosition(e.clientX, rect, min, max, step);
        if (dragging.current === "low") {
          update([clamp(v, min, val[1]), val[1]]);
        } else {
          update([val[0], clamp(v, val[0], max)]);
        }
      },
      [disabled, min, max, step, val, update]
    );

    const handlePointerUp = useCallback(() => {
      dragging.current = null;
    }, []);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2 w-full", disabled && "opacity-50", className)}
        {...rest}
      >
        {label && <span className="text-sm font-medium text-grey-900 leading-[1.45]">{label}</span>}
        <div
          ref={trackRef}
          className={cn(
            "relative w-full rounded-full bg-grey-200 cursor-pointer",
            config.track,
            disabled && "cursor-not-allowed"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="slider"
          aria-valuenow={val[0]}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Filled range track */}
          <div
            className={cn("absolute top-0 rounded-full bg-primary-400", config.track)}
            style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          />
          {/* Low handle */}
          <div
            className={cn(
              "absolute top-1/2 rounded-full bg-primary-500 border-white border-solid shadow-sm z-10",
              config.handle,
              config.border
            )}
            style={{ left: `${lowPct}%`, transform: `translate(-50%, -50%)` }}
          />
          {/* High handle */}
          <div
            className={cn(
              "absolute top-1/2 rounded-full bg-primary-500 border-white border-solid shadow-sm z-10",
              config.handle,
              config.border
            )}
            style={{ left: `${highPct}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>
        {showLabels && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-grey-500 leading-[1.45]">
              {Math.round(getPercent(val[0], min, max))}%
            </span>
            <span className="text-sm font-semibold text-grey-500 text-right leading-[1.45]">
              {Math.round(getPercent(val[1], min, max))}%
            </span>
          </div>
        )}
      </div>
    );
  }
);
RangeSlider.displayName = "RangeSlider";
