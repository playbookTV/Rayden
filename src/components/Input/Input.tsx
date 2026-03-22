import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

export type InputSize = "xs" | "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
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
  /** Leading addon element (e.g. dropdown, button). Renders as a separated section before the input. */
  leadingAddon?: ReactNode;
  /** Trailing addon element (e.g. button). Renders as a separated section after the input. */
  trailingAddon?: ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

const inputFrameSize: Record<InputSize, string> = {
  xs: "px-2.5 py-2 gap-2",
  sm: "p-3 gap-3",
  md: "px-4 py-3 gap-3",
  lg: "px-4 py-3 gap-3",
};

const addonHeight: Record<InputSize, string> = {
  xs: "",
  sm: "h-10",
  md: "h-12",
  lg: "h-14",
};

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
      leadingAddon,
      trailingAddon,
      readOnly,
      disabled,
      className,
      wrapperClassName,
      id,
      required,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const hasError = !!error;
    const hasSuccess = !!success;
    const hasAddon = !!leadingAddon || !!trailingAddon;

    const bottomText = hasError
      ? typeof error === "string"
        ? error
        : undefined
      : hasSuccess
        ? typeof success === "string"
          ? success
          : undefined
        : helperText;

    const descriptionId = bottomText ? `${inputId}-description` : undefined;

    const borderColor = hasError
      ? "border-error-400 focus-within:border-error-400"
      : hasSuccess
        ? "border-success-400 focus-within:border-success-400"
        : "border-grey-300 hover:border-primary-100 focus-within:border-primary-400";

    const inputBg = readOnly ? "bg-grey-100" : disabled ? "bg-grey-50" : "bg-white dark:bg-grey-50";

    // When addons are present, the container is a flex row with no border — addons and input have their own borders
    if (hasAddon) {
      return (
        <div className={cn("flex flex-col gap-1 w-full", wrapperClassName)}>
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-grey-900 leading-[1.45]">
              {label}
            </label>
          )}
          <div className={cn("flex items-stretch", addonHeight[size])}>
            {/* Leading addon */}
            {leadingAddon && (
              <div
                className={cn(
                  "flex items-center gap-1 px-3 py-2 bg-grey-50 border border-r-0 border-grey-300 rounded-l-lg overflow-hidden shrink-0",
                  "text-sm font-medium text-grey-700"
                )}
              >
                {leadingAddon}
              </div>
            )}

            {/* Input frame */}
            <div
              className={cn(
                "flex flex-1 items-center border overflow-hidden transition-colors",
                inputFrameSize[size],
                inputBg,
                borderColor,
                !leadingAddon && !trailingAddon && "rounded-lg",
                leadingAddon && !trailingAddon && "rounded-r-lg",
                !leadingAddon && trailingAddon && "rounded-l-lg",
                leadingAddon && trailingAddon && "",
                disabled && "cursor-not-allowed"
              )}
            >
              {leadingIcon && (
                <span className="shrink-0 size-6 text-grey-400">
                  {resolveIcon(leadingIcon, "md")}
                </span>
              )}
              <input
                ref={ref}
                id={inputId}
                readOnly={readOnly}
                disabled={disabled}
                required={required}
                aria-invalid={hasError || undefined}
                aria-required={required || undefined}
                aria-describedby={descriptionId}
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 outline-none disabled:cursor-not-allowed",
                  className
                )}
                {...rest}
              />
              {addonRight && <span className="shrink-0 text-sm text-grey-500">{addonRight}</span>}
              {trailingIcon && (
                <span className="shrink-0 size-6 text-grey-400">
                  {resolveIcon(trailingIcon, "md")}
                </span>
              )}
            </div>

            {/* Trailing addon */}
            {trailingAddon && (
              <div
                className={cn(
                  "flex items-center gap-1 px-3 py-2 bg-grey-50 border border-l-0 border-grey-300 rounded-r-lg overflow-hidden shrink-0",
                  "text-sm font-medium text-grey-700"
                )}
              >
                {trailingAddon}
              </div>
            )}
          </div>
          {bottomText && (
            <p
              id={descriptionId}
              className={cn(
                "text-sm leading-[1.45]",
                hasError ? "text-error-400" : hasSuccess ? "text-success-400" : "text-grey-500"
              )}
            >
              {bottomText}
            </p>
          )}
        </div>
      );
    }

    // Standard input (no addons)
    return (
      <div className={cn("flex flex-col gap-1 w-full", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-grey-900 leading-[1.45]">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center border rounded-lg overflow-hidden transition-colors",
            inputFrameSize[size],
            addonHeight[size],
            readOnly
              ? "bg-grey-100 border-grey-300"
              : disabled
                ? "bg-grey-50 border-grey-200 cursor-not-allowed"
                : cn("bg-white dark:bg-grey-50", borderColor)
          )}
        >
          {leadingIcon && (
            <span className="shrink-0 size-6 text-grey-400">{resolveIcon(leadingIcon, "md")}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            readOnly={readOnly}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={descriptionId}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 outline-none disabled:cursor-not-allowed",
              className
            )}
            {...rest}
          />
          {addonRight && <span className="shrink-0 text-sm text-grey-500">{addonRight}</span>}
          {trailingIcon && (
            <span className="shrink-0 size-6 text-grey-400">{resolveIcon(trailingIcon, "md")}</span>
          )}
        </div>
        {bottomText && (
          <p
            id={descriptionId}
            className={cn(
              "text-sm leading-[1.45]",
              hasError ? "text-error-400" : hasSuccess ? "text-success-400" : "text-grey-500"
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
