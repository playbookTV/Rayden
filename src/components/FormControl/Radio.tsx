import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  position?: "left" | "right";
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, position = "left", className, ...rest }, ref) => {
    const control = (
      <div className="relative shrink-0 size-5">
        <input
          ref={ref}
          type="radio"
          className={cn(
            "peer size-5 appearance-none rounded-full border-[1.5px] border-grey-300 bg-white cursor-pointer",
            "checked:border-primary-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...rest}
        />
        <div className="pointer-events-none absolute inset-0 m-auto size-2.5 rounded-full bg-primary-400 hidden peer-checked:block" />
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

Radio.displayName = "Radio";
