import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  position?: "left" | "right";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, position = "left", className, ...rest }, ref) => {
    const control = (
      <div className="relative shrink-0 size-5">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer size-5 appearance-none rounded border-[1.5px] border-grey-300 bg-white cursor-pointer",
            "checked:bg-primary-400 checked:border-primary-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...rest}
        />
        <svg
          viewBox="0 0 14 14"
          fill="none"
          className="pointer-events-none absolute inset-0 m-auto size-3 hidden peer-checked:block text-white"
        >
          <path
            d="M11.5 3.5L5.5 10L2.5 7"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );

    if (!label && !description) {
      return control;
    }

    return (
      <label
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer",
          className
        )}
      >
        {position === "left" && control}
        <div className="flex flex-col">
          {label && (
            <span className="text-base font-medium text-grey-900">
              {label}
            </span>
          )}
          {description && (
            <span className="text-sm text-grey-500">{description}</span>
          )}
        </div>
        {position === "right" && control}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
