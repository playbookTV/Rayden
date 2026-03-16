import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  position?: "left" | "right";
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, position = "left", className, ...rest }, ref) => {
    const descriptionId = useId();
    const control = (
      <div className="relative shrink-0 w-9 h-5">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "peer size-full appearance-none rounded-full bg-grey-200 cursor-pointer transition-colors",
            "checked:bg-primary-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...rest}
        />
        <div
          className={cn(
            "pointer-events-none absolute top-0.5 left-0.5 size-4 rounded-full bg-white dark:bg-grey-50 shadow-sm transition-transform",
            "peer-checked:translate-x-4"
          )}
        />
      </div>
    );

    if (!label && !description) {
      return control;
    }

    return (
      <label className={cn("inline-flex items-center gap-3 cursor-pointer", className)}>
        {position === "left" && control}
        <div className="flex flex-col">
          {label && <span className="text-base font-medium text-grey-900">{label}</span>}
          {description && (
            <span id={descriptionId} className="text-sm text-grey-500">
              {description}
            </span>
          )}
        </div>
        {position === "right" && control}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
