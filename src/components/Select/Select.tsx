import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  forwardRef,
  Children,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { usePopupList } from "../../hooks/usePopupList";
import { cn } from "../../utils/cn";
import { useCollisionAwareSide } from "../../hooks/useCollisionAwareSide";
import { resolveIcon } from "../../utils/resolveIcon";
import { Icon } from "../Icon";
import type { IconSource } from "../Icon";
import type { SelectOptionProps } from "./SelectOption";

// ─── Context ──────────────────────────────────────────────────────
export interface SelectContextValue {
  value: string;
  onSelect: (value: string) => void;
  open: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("SelectOption must be used within <Select>");
  return ctx;
}

// ─── Helper: find selected option props from children ─────────────
interface SelectedOptionInfo {
  label: ReactNode;
  icon?: IconSource;
  avatar?: ReactNode;
  statusColor?: string;
  description?: string;
}

function findSelectedOption(children: ReactNode, value: string): SelectedOptionInfo | null {
  let found: SelectedOptionInfo | null = null;
  Children.forEach(children, (child) => {
    if (found) return;
    if (isValidElement<SelectOptionProps>(child) && child.props.value === value) {
      found = {
        label: child.props.children,
        icon: child.props.icon,
        avatar: child.props.avatar,
        statusColor: child.props.statusColor,
        description: child.props.description,
      };
    } else if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      found = findSelectedOption(child.props.children, value);
    }
  });
  return found;
}

// ─── Select ───────────────────────────────────────────────────────
export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Label text above the select */
  label?: string;
  /** Helper text below the select */
  helperText?: string;
  /**
   * Error message, or true for an error state with no message. Replaces helperText
   * and marks the trigger aria-invalid. Mirrors Input's error contract so the
   * useRaydenSelect adapter has somewhere to deliver validation feedback.
   */
  error?: string | boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Wrapper className for the outermost div */
  wrapperClassName?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      placeholder = "Select an option",
      label,
      helperText,
      error,
      disabled = false,
      children,
      className,
      wrapperClassName,
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useControllableValue(controlledValue, defaultValue, onValueChange);
    const [open, setOpen] = useState(false);

    const hasError = error !== undefined && error !== false;
    const bottomText = hasError ? (typeof error === "string" ? error : undefined) : helperText;

    const listboxId = useId();
    const labelId = useId();
    const helperId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    // The listbox always opened downward, so near the bottom edge it ran off-screen.
    // The listbox always opened downward, so near the bottom edge it ran off-screen.
    const listSide = useCollisionAwareSide("bottom", open, triggerRef, listRef);

    const { close, onTriggerKeyDown, onListKeyDown } = usePopupList({
      open,
      setOpen,
      containerRef,
      triggerRef,
      listRef,
      role: "option",
      selected: true,
    });
    const onSelect = useCallback(
      (val: string) => {
        close(true);
        setValue(val);
      },
      [close, setValue]
    );

    // Find selected option info for trigger display
    const selectedOption = value ? findSelectedOption(children, value) : null;

    // Resolve leading element for trigger
    const triggerLeading = selectedOption ? (
      selectedOption.avatar ? (
        selectedOption.avatar
      ) : selectedOption.statusColor ? (
        <span
          className="shrink-0 size-2 rounded-full border-[1.5px] border-white"
          style={{ backgroundColor: selectedOption.statusColor }}
        />
      ) : selectedOption.icon ? (
        <span className="shrink-0 size-5">{resolveIcon(selectedOption.icon, "md")}</span>
      ) : null
    ) : null;

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        {...rest}
        className={cn("relative flex flex-col gap-2 w-full", wrapperClassName)}
      >
        {/* Label */}
        {label && (
          <label id={labelId} className="text-sm font-medium text-on-surface leading-[1.45]">
            {label}
          </label>
        )}

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={bottomText ? helperId : undefined}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          onKeyDown={onTriggerKeyDown}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-md border px-4 transition-colors",
            disabled
              ? "bg-grey-100 border-control-border-disabled cursor-not-allowed"
              : hasError
                ? "bg-surface border-error-400"
                : open
                  ? "bg-surface border-[#1671D9]"
                  : "bg-surface border-control-border hover:border-[#B6D8FF]",
            className
          )}
        >
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {triggerLeading}
            <span
              className={cn(
                "truncate text-body-sm",
                selectedOption ? "text-on-surface" : "text-on-surface-muted"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <Icon
            name="chevron-down"
            size="md"
            aria-hidden="true"
            className={cn(
              "shrink-0 transition-transform",
              open && "rotate-180",
              disabled ? "text-grey-300" : "text-on-surface-muted"
            )}
          />
        </button>

        {/* Helper text */}
        {bottomText && (
          <p
            id={helperId}
            className={cn(
              "text-sm leading-[1.45]",
              hasError ? "text-feedback-error" : "text-on-surface-muted"
            )}
          >
            {bottomText}
          </p>
        )}

        {/* Options panel */}
        {open && (
          <SelectContext.Provider value={{ value, onSelect, open }}>
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              onKeyDown={onListKeyDown}
              className={cn(
                "absolute left-0 right-0 z-50 max-h-[320px] overflow-y-auto rounded-lg border border-grey-200 bg-surface py-1 shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)]",
                listSide === "top" ? "bottom-full mb-2" : "top-full mt-2"
              )}
            >
              {children}
            </div>
          </SelectContext.Provider>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
