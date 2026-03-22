import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type StepperOrientation = "horizontal" | "vertical";
export type StepStatus = "completed" | "active" | "incomplete" | "disabled";
export type StepIndicator = "dot" | "number" | "icon";

export interface StepItem {
  /** Step title */
  title: string;
  /** Optional description */
  description?: string;
  /** Step status */
  status?: StepStatus;
  /** Custom icon for completed or active state */
  icon?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of step items */
  steps: StepItem[];
  /** Current active step index (0-based). Overrides individual step statuses. */
  activeStep?: number;
  /** Layout direction */
  orientation?: StepperOrientation;
  /** Indicator style inside the step circle */
  indicator?: StepIndicator;
}

export interface LinearStepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Current step (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Show the step counter label */
  showLabel?: boolean;
}

export interface SegmentedStepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Current step (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Show the step counter label */
  showLabel?: boolean;
}

/* ─── Icons ────────────────────────────────────────────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

/* ─── Step Indicator Circle ────────────────────────────────────────────── */

function StepCircle({
  status,
  indicator,
  stepNumber,
  icon,
}: {
  status: StepStatus;
  indicator: StepIndicator;
  stepNumber: number;
  icon?: ReactNode;
}) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isDisabled = status === "disabled";

  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center rounded-full size-6 border transition-colors",
        isCompleted && "bg-primary-400 border-primary-400 text-white",
        isActive && "bg-primary-50 border-primary-400 text-primary-400",
        !isCompleted && !isActive && !isDisabled && "bg-white dark:bg-grey-50 border-grey-300",
        isDisabled && "bg-grey-100 border-grey-200 text-grey-300"
      )}
    >
      {isCompleted ? (
        (icon ?? <CheckIcon className="size-3.5" />)
      ) : indicator === "dot" ? (
        <div
          className={cn(
            "size-2 rounded-full border",
            isActive
              ? "bg-primary-400 border-primary-400"
              : isDisabled
                ? "bg-grey-300 border-grey-300"
                : "bg-grey-400 border-grey-300"
          )}
        />
      ) : indicator === "number" ? (
        <span
          className={cn(
            "text-xs font-medium",
            isActive ? "text-primary-400" : isDisabled ? "text-grey-300" : "text-grey-500"
          )}
        >
          {stepNumber}
        </span>
      ) : (
        (icon ?? (
          <div
            className={cn(
              "size-2 rounded-full",
              isActive ? "bg-primary-400" : isDisabled ? "bg-grey-300" : "bg-grey-400"
            )}
          />
        ))
      )}
    </div>
  );
}

/* ─── Connector Line ───────────────────────────────────────────────────── */

function Connector({
  orientation,
  completed,
}: {
  orientation: StepperOrientation;
  completed: boolean;
}) {
  return orientation === "horizontal" ? (
    <div
      className={cn("flex-1 h-0.5 rounded-full", completed ? "bg-primary-400" : "bg-grey-300")}
    />
  ) : (
    <div
      className={cn(
        "w-0.5 flex-1 min-h-[20px] ml-[11px] rounded-full",
        completed ? "bg-primary-400" : "bg-grey-300"
      )}
    />
  );
}

/* ─── Stepper ──────────────────────────────────────────────────────────── */

function resolveStatuses(steps: StepItem[], activeStep?: number): StepStatus[] {
  if (activeStep !== undefined) {
    return steps.map((s, i) => {
      if (s.status === "disabled") return "disabled";
      if (i < activeStep) return "completed";
      if (i === activeStep) return "active";
      return "incomplete";
    });
  }
  return steps.map((s) => s.status ?? "incomplete");
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    { steps, activeStep, orientation = "horizontal", indicator = "dot", className, ...rest },
    ref
  ) => {
    const statuses = resolveStatuses(steps, activeStep);

    if (orientation === "vertical") {
      return (
        <div ref={ref} className={cn("flex flex-col", className)} {...rest}>
          {steps.map((step, i) => {
            const status = statuses[i];
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <StepCircle
                    status={status}
                    indicator={indicator}
                    stepNumber={i + 1}
                    icon={step.icon}
                  />
                  {!isLast && (
                    <Connector orientation="vertical" completed={status === "completed"} />
                  )}
                </div>
                <div className="flex flex-col pb-6">
                  <span
                    className={cn(
                      "text-sm font-medium leading-[1.45]",
                      status === "active"
                        ? "text-grey-900"
                        : status === "disabled"
                          ? "text-grey-300"
                          : "text-grey-600"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-grey-500 leading-[1.45]">{step.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Horizontal
    return (
      <div ref={ref} className={cn("flex items-start w-full", className)} {...rest}>
        {steps.map((step, i) => {
          const status = statuses[i];
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex flex-col flex-1 items-center gap-2.5">
              <div className="flex items-center gap-1 w-full">
                <Connector
                  orientation="horizontal"
                  completed={i > 0 && statuses[i - 1] === "completed"}
                />
                <StepCircle
                  status={status}
                  indicator={indicator}
                  stepNumber={i + 1}
                  icon={step.icon}
                />
                <Connector orientation="horizontal" completed={!isLast && status === "completed"} />
              </div>
              <div className="flex flex-col gap-0.5 text-center w-full">
                <span
                  className={cn(
                    "text-xs font-medium leading-[1.45] tracking-tight",
                    status === "active"
                      ? "text-grey-700"
                      : status === "disabled"
                        ? "text-grey-300"
                        : "text-grey-600"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-grey-500 leading-[1.45] truncate">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
Stepper.displayName = "Stepper";

/* ─── LinearStepper ────────────────────────────────────────────────────── */

export const LinearStepper = forwardRef<HTMLDivElement, LinearStepperProps>(
  ({ currentStep, totalSteps, showLabel = true, className, ...rest }, ref) => {
    const pct = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
    return (
      <div ref={ref} className={cn("flex flex-col gap-2 w-full", className)} {...rest}>
        {showLabel && (
          <p className="text-sm font-semibold leading-[1.45]">
            <span className="text-grey-900">{currentStep}</span>
            <span className="text-grey-400"> / {totalSteps} complete</span>
          </p>
        )}
        <div className="bg-grey-200 rounded-full p-1 w-full overflow-hidden">
          <div
            className="h-2 bg-primary-400 rounded-[10px] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);
LinearStepper.displayName = "LinearStepper";

/* ─── SegmentedStepper ─────────────────────────────────────────────────── */

export const SegmentedStepper = forwardRef<HTMLDivElement, SegmentedStepperProps>(
  ({ currentStep, totalSteps, showLabel = true, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2 w-full", className)} {...rest}>
        {showLabel && (
          <p className="text-sm font-semibold leading-[1.45]">
            <span className="text-grey-900">{currentStep}</span>
            <span className="text-grey-400"> / {totalSteps} complete</span>
          </p>
        )}
        <div className="bg-grey-200 rounded-full p-1 w-full overflow-hidden">
          <div className="flex gap-1 h-2 w-full">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-[14px] border border-grey-50 transition-colors",
                  i < currentStep ? "bg-primary-400" : "bg-grey-50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
SegmentedStepper.displayName = "SegmentedStepper";
