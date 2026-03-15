import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type InputSize = "sm" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input size variant */
  size?: InputSize;
  /** Label text above the input */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message or boolean. Overrides helperText styling. */
  error?: string | boolean;
  /** Success message or boolean. Overrides helperText styling. */
  success?: string | boolean;
  /** Icon on the left side of the input */
  leadingIcon?: ReactNode | IconName;
  /** Icon on the right side of the input */
  trailingIcon?: ReactNode | IconName;
  /** Text addon on the right side */
  addonRight?: string;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "sm",
      label,
      helperText,
      error,
      success,
      leadingIcon,
      trailingIcon,
      addonRight,
      readOnly,
      disabled,
      className,
      wrapperClassName,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    const hasError = !!error;
    const hasSuccess = !!success;

    const bottomText = hasError
      ? typeof error === "string"
        ? error
        : undefined
      : hasSuccess
        ? typeof success === "string"
          ? success
          : undefined
        : helperText;

    const borderColor = hasError
      ? "border-error-200 focus-within:border-error-200"
      : hasSuccess
        ? "border-success-200 focus-within:border-success-200"
        : "border-grey-300 hover:border-primary-100 focus-within:border-primary-200";

    return (
      <div className={cn("flex flex-col gap-2 w-full", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-grey-900 leading-[1.45]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-3 border rounded-md overflow-hidden transition-colors",
            size === "sm" ? "h-9 px-3 py-2" : "h-14 p-4",
            readOnly
              ? "bg-grey-100 border-grey-300"
              : disabled
                ? "bg-grey-50 border-grey-200 cursor-not-allowed"
                : cn("bg-white", borderColor)
          )}
        >
          {leadingIcon && (
            <span className="shrink-0 size-5 text-grey-400">
              {resolveIcon(leadingIcon, "md")}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            readOnly={readOnly}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 outline-none disabled:cursor-not-allowed",
              className
            )}
            {...rest}
          />
          {addonRight && (
            <span className="shrink-0 text-sm text-grey-500">{addonRight}</span>
          )}
          {trailingIcon && (
            <span className="shrink-0 size-5 text-grey-400">
              {resolveIcon(trailingIcon, "md")}
            </span>
          )}
        </div>
        {bottomText && (
          <p
            className={cn(
              "text-sm leading-[1.45]",
              hasError
                ? "text-error-500"
                : hasSuccess
                  ? "text-success-600"
                  : "text-grey-500"
            )}
          >
            {bottomText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
