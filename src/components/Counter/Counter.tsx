import { forwardRef, useCallback, useState, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type CounterSize = "sm" | "md" | "lg";
export type CounterShape = "rounded" | "block" | "pill";

export interface CounterProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Current value */
  value?: number;
  /** Called when value changes */
  onChange?: (value: number) => void;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Size variant */
  size?: CounterSize;
  /** Shape of the container */
  shape?: CounterShape;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
}

export type NumberCounterSize = "sm" | "md" | "lg";
export type NumberCounterColor = "orange" | "red" | "grey" | "white";

export interface NumberCounterProps extends HTMLAttributes<HTMLDivElement> {
  /** Display value */
  value: number | string;
  /** Size */
  size?: NumberCounterSize;
  /** Background color */
  color?: NumberCounterColor;
}

/* ─── Icons ────────────────────────────────────────────────────────────── */

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ─── Size Config ──────────────────────────────────────────────────────── */

const buttonSize: Record<CounterSize, string> = {
  sm: "size-8 rounded-[10px]",
  md: "size-10 rounded-xl",
  lg: "size-12 rounded-xl",
};

const iconSize: Record<CounterSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const containerShape: Record<CounterShape, Record<string, string>> = {
  rounded: { sm: "rounded-[10px]", md: "rounded-xl", lg: "rounded-xl" },
  block: { sm: "", md: "", lg: "" },
  pill: { sm: "rounded-full", md: "rounded-[28px]", lg: "rounded-[28px]" },
};

const valueText: Record<CounterSize, string> = {
  sm: "text-sm w-7",
  md: "text-sm w-7",
  lg: "text-base w-7",
};

/* ─── Counter ──────────────────────────────────────────────────────────── */

export const Counter = forwardRef<HTMLDivElement, CounterProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultValue = 0,
      size = "sm",
      shape = "rounded",
      min = 0,
      max = Infinity,
      step = 1,
      disabled = false,
      className,
      ...rest
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const val = controlledValue ?? uncontrolled;

    const update = useCallback(
      (next: number) => {
        const clamped = Math.min(max, Math.max(min, next));
        if (controlledValue === undefined) setUncontrolled(clamped);
        onChange?.(clamped);
      },
      [controlledValue, onChange, min, max]
    );

    const canDecrement = val > min;
    const canIncrement = val < max;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center border border-grey-300 overflow-hidden",
          containerShape[shape][size],
          disabled && "opacity-50",
          className
        )}
        {...rest}
      >
        {/* Decrement */}
        <button
          type="button"
          disabled={disabled || !canDecrement}
          onClick={() => update(val - step)}
          className={cn(
            "flex items-center justify-center p-2.5 text-grey-900 cursor-pointer transition-colors hover:bg-grey-100",
            buttonSize[size],
            (disabled || !canDecrement) && "text-grey-300 cursor-not-allowed hover:bg-transparent"
          )}
          aria-label="Decrease"
        >
          <MinusIcon className={iconSize[size]} />
        </button>

        {/* Value */}
        <div className="flex items-center justify-center shrink-0">
          <span
            className={cn("font-medium text-grey-900 text-center leading-[1.45]", valueText[size])}
          >
            {val}
          </span>
        </div>

        {/* Increment */}
        <button
          type="button"
          disabled={disabled || !canIncrement}
          onClick={() => update(val + step)}
          className={cn(
            "flex items-center justify-center p-2.5 text-grey-900 cursor-pointer transition-colors hover:bg-grey-100",
            buttonSize[size],
            (disabled || !canIncrement) && "text-grey-300 cursor-not-allowed hover:bg-transparent"
          )}
          aria-label="Increase"
        >
          <PlusIcon className={iconSize[size]} />
        </button>
      </div>
    );
  }
);
Counter.displayName = "Counter";

/* ─── NumberCounter ────────────────────────────────────────────────────── */

const ncSize: Record<NumberCounterSize, { container: string; text: string }> = {
  sm: { container: "p-1 rounded-[4px]", text: "text-xs size-4" },
  md: { container: "p-1 rounded-md size-7", text: "text-sm" },
  lg: { container: "p-2 rounded-md size-9", text: "text-base" },
};

const ncColor: Record<NumberCounterColor, { bg: string; text: string }> = {
  orange: { bg: "bg-primary-400", text: "text-white" },
  red: { bg: "bg-error-400", text: "text-white" },
  grey: { bg: "bg-grey-300", text: "text-white" },
  white: { bg: "bg-white dark:bg-grey-50", text: "text-grey-600" },
};

export const NumberCounter = forwardRef<HTMLDivElement, NumberCounterProps>(
  ({ value, size = "sm", color = "orange", className, ...rest }, ref) => {
    const s = ncSize[size];
    const c = ncColor[color];
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", s.container, c.bg, className)}
        {...rest}
      >
        <span
          className={cn("font-semibold text-center leading-[1.45] tracking-tight", s.text, c.text)}
        >
          {value}
        </span>
      </div>
    );
  }
);
NumberCounter.displayName = "NumberCounter";
