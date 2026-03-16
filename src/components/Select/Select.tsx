import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  forwardRef,
  Children,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";
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
  icon?: ReactNode | IconName;
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
      disabled = false,
      children,
      className,
      wrapperClassName,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const value = controlledValue ?? internalValue;

    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const onSelect = useCallback(
      (val: string) => {
        if (controlledValue === undefined) setInternalValue(val);
        onValueChange?.(val);
        setOpen(false);
        // Return focus to trigger
        setTimeout(() => triggerRef.current?.focus(), 0);
      },
      [controlledValue, onValueChange]
    );

    // Click-outside handler
    useEffect(() => {
      if (!open) return;
      const handleMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleMouseDown);
      return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open]);

    // Escape key handler
    useEffect(() => {
      if (!open) return;
      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    // Focus first/selected option on open
    useEffect(() => {
      if (!open) return;
      const timer = setTimeout(() => {
        const selected = listRef.current?.querySelector<HTMLButtonElement>(
          '[role="option"][aria-selected="true"]'
        );
        const first = listRef.current?.querySelector<HTMLButtonElement>(
          '[role="option"]:not([disabled])'
        );
        (selected ?? first)?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }, [open]);

    // Keyboard navigation in the listbox
    const handleListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]:not([disabled])') ??
          []
      );
      if (!items.length) return;

      const currentIndex = items.findIndex((item) => item === document.activeElement);

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[next]?.focus();
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prev]?.focus();
          break;
        }
        case "Home": {
          e.preventDefault();
          items[0]?.focus();
          break;
        }
        case "End": {
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        }
      }
    };

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
        className={cn("relative flex flex-col gap-2 w-full", wrapperClassName)}
        {...rest}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-grey-900 leading-[1.45]">{label}</label>
        )}

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-md border px-4 transition-colors",
            disabled
              ? "bg-grey-100 border-grey-300 cursor-not-allowed"
              : open
                ? "bg-white dark:bg-grey-50 border-[#1671D9]"
                : "bg-white dark:bg-grey-50 border-grey-300 hover:border-[#B6D8FF]",
            className
          )}
        >
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {triggerLeading}
            <span
              className={cn(
                "truncate text-body-sm",
                selectedOption ? "text-grey-900" : "text-grey-400"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <Icon
            name="chevron-down"
            size="md"
            className={cn(
              "shrink-0 transition-transform",
              open && "rotate-180",
              disabled ? "text-grey-300" : "text-grey-500"
            )}
          />
        </button>

        {/* Helper text */}
        {helperText && <p className="text-sm text-grey-500 leading-[1.45]">{helperText}</p>}

        {/* Options panel */}
        {open && (
          <SelectContext.Provider value={{ value, onSelect, open }}>
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              onKeyDown={handleListKeyDown}
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-lg border border-grey-200 bg-white dark:bg-grey-50 py-1 shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)]"
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
