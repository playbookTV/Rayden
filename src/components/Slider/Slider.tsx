import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
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
  return max > min ? ((val - min) / (max - min)) * 100 : 0;
}

function snapValue(value: number, min: number, max: number, step: number) {
  const increment = step > 0 ? step : 1;
  return clamp(
    Number((min + Math.round((value - min) / increment) * increment).toFixed(10)),
    min,
    max
  );
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
  return snapValue(raw, min, max, step);
}

function keyboardValue(key: string, value: number, min: number, max: number, step: number) {
  const delta = step > 0 ? step : 1;
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return clamp(value + delta, min, max);
    case "ArrowLeft":
    case "ArrowDown":
      return clamp(value - delta, min, max);
    case "PageUp":
      return clamp(value + delta * 10, min, max);
    case "PageDown":
      return clamp(value - delta * 10, min, max);
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return null;
  }
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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState(min);
    const val = clamp(controlledValue ?? uncontrolled, min, max);
    const labelId = useId();
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
        e.currentTarget.setPointerCapture(e.pointerId);
        (e.currentTarget as HTMLElement).focus();
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
        {label && (
          <span id={labelId} className="text-sm font-medium text-grey-900 leading-[1.45]">
            {label}
          </span>
        )}
        <div
          ref={trackRef}
          className={cn(
            "relative w-full h-11 touch-none cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
            disabled && "cursor-not-allowed"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onKeyDown={(event) => {
            if (disabled) return;
            const next = keyboardValue(event.key, val, min, max, step);
            if (next === null) return;
            event.preventDefault();
            if (controlledValue === undefined) setUncontrolled(next);
            onChange?.(next);
          }}
          aria-label={ariaLabel ?? (!label && !ariaLabelledBy ? "Value" : undefined)}
          aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
          aria-disabled={disabled || undefined}
          role="slider"
          aria-valuenow={val}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-grey-200",
              config.track
            )}
          />
          {/* Filled track */}
          <div
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-action-primary",
              config.track
            )}
            style={{ width: `${pct}%` }}
          />
          {/* Handle */}
          <div
            className={cn(
              "absolute top-1/2 rounded-full bg-action-primary border-white border-solid shadow-sm",
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
                    {i > 0 && <span className="text-xs text-grey-500">•</span>}
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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState<[number, number]>(() => [
      snapValue(min + (max - min) * 0.25, min, max, step),
      snapValue(min + (max - min) * 0.75, min, max, step),
    ]);
    const rawValue = controlledValue ?? uncontrolled;
    const val = useMemo<[number, number]>(() => {
      const low = clamp(rawValue[0], min, max);
      return [low, clamp(rawValue[1], low, max)];
    }, [rawValue, min, max]);
    const labelId = useId();
    const lowRef = useRef<HTMLDivElement>(null);
    const highRef = useRef<HTMLDivElement>(null);
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
        e.currentTarget.setPointerCapture(e.pointerId);
        const rect = trackRef.current.getBoundingClientRect();
        const v = getValueFromPosition(e.clientX, rect, min, max, step);
        const distLow = Math.abs(v - val[0]);
        const distHigh = Math.abs(v - val[1]);
        dragging.current =
          ((e.target as HTMLElement).closest<HTMLElement>("[data-thumb]")?.dataset.thumb as
            | "low"
            | "high") || (distLow <= distHigh ? "low" : "high");
        (dragging.current === "low" ? lowRef : highRef).current?.focus();
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
        {label && (
          <span id={labelId} className="text-sm font-medium text-grey-900 leading-[1.45]">
            {label}
          </span>
        )}
        <div
          ref={trackRef}
          className={cn(
            "relative w-full h-11 touch-none cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
            disabled && "cursor-not-allowed"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-grey-200",
              config.track
            )}
          />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full bg-action-primary",
              config.track
            )}
            style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          />
          {(["low", "high"] as const).map((thumb, index) => (
            <div
              key={thumb}
              ref={thumb === "low" ? lowRef : highRef}
              data-thumb={thumb}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled || undefined}
              aria-label={`${ariaLabel ?? label ?? "Range"} ${index === 0 ? "minimum" : "maximum"}`}
              aria-describedby={ariaLabelledBy}
              aria-valuenow={val[index]}
              aria-valuemin={index === 0 ? min : val[0]}
              aria-valuemax={index === 0 ? val[1] : max}
              onKeyDown={(event) => {
                if (disabled) return;
                const next = keyboardValue(
                  event.key,
                  val[index],
                  index === 0 ? min : val[0],
                  index === 0 ? val[1] : max,
                  step
                );
                if (next === null) return;
                event.preventDefault();
                update(index === 0 ? [next, val[1]] : [val[0], next]);
              }}
              className="absolute top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-action-primary-text"
              style={{ left: `${index === 0 ? lowPct : highPct}%` }}
            >
              <div
                className={cn(
                  "rounded-full bg-action-primary border-white border-solid shadow-sm",
                  config.handle,
                  config.border
                )}
              />
            </div>
          ))}
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
