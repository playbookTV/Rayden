import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  description?: string;
  position?: "left" | "right";
  /** Class names for the label wrapper. `className` styles the control itself. */
  wrapperClassName?: string;
  /** Mixed state, e.g. a select-all box when only some rows are selected. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      position = "left",
      indeterminate = false,
      className,
      wrapperClassName,
      ...rest
    },
    ref
  ) => {
    const descriptionId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    // `indeterminate` has no HTML attribute; it must be set on the element.
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    const control = (
      <div className="relative shrink-0 size-5">
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="checkbox"
          aria-checked={indeterminate ? "mixed" : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(
            "peer size-5 appearance-none rounded border-[1.5px] border-grey-300 bg-white dark:bg-grey-50 cursor-pointer",
            "checked:bg-primary-400 checked:border-primary-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
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
      <label className={cn("inline-flex items-center gap-3 cursor-pointer", wrapperClassName)}>
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

Checkbox.displayName = "Checkbox";
