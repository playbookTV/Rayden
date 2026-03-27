import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type AccordionType = "default" | "nested";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual type: default (border-bottom) or nested (full border with rounded corners) */
  type?: AccordionType;
  /** Allow multiple items open simultaneously */
  multiple?: boolean;
  /** Controlled open item keys */
  value?: string[];
  /** Default open item keys (uncontrolled) */
  defaultValue?: string[];
  /** Callback when open items change */
  onValueChange?: (value: string[]) => void;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique key for this item */
  value: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Leading icon (left side) */
  leadingIcon?: ReactNode | IconName;
  /** Leading number badge */
  leadingNumber?: string;
  /** Leading logo element */
  leadingLogo?: ReactNode;
  /** Badge counter value */
  badge?: number | string;
  /** Hide the chevron indicator */
  hideChevron?: boolean;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

/* ─── Context ──────────────────────────────────────────────────────────── */

interface AccordionContextValue {
  type: AccordionType;
  openItems: string[];
  toggle: (value: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compound components must be used within <Accordion>");
  return ctx;
}

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("AccordionTrigger/Content must be used within <AccordionItem>");
  return ctx;
}

/* ─── Chevron ──────────────────────────────────────────────────────────── */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ─── Accordion Root ───────────────────────────────────────────────────── */

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "default",
      multiple = false,
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue);
    const openItems = controlledValue ?? uncontrolledValue;

    const toggle = useCallback(
      (itemValue: string) => {
        const next = openItems.includes(itemValue)
          ? openItems.filter((v) => v !== itemValue)
          : multiple
            ? [...openItems, itemValue]
            : [itemValue];

        if (!controlledValue) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [openItems, multiple, controlledValue, onValueChange]
    );

    return (
      <AccordionContext.Provider value={{ type, openItems, toggle }}>
        <div
          ref={ref}
          className={cn("w-full", type === "nested" && "flex flex-col gap-3", className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

/* ─── AccordionItem ────────────────────────────────────────────────────── */

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...rest }, ref) => {
    const { type, openItems } = useAccordionContext();
    const isOpen = openItems.includes(value);
    const generatedId = useId();
    const triggerId = `accordion-trigger-${generatedId}`;
    const contentId = `accordion-content-${generatedId}`;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, disabled, triggerId, contentId }}>
        <div
          ref={ref}
          className={cn(
            "border-solid transition-colors",
            type === "default"
              ? cn("border-b", isOpen ? "border-primary-300" : "border-grey-100")
              : cn("border rounded-[10px]", isOpen ? "border-primary-300" : "border-grey-75"),
            className
          )}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

/* ─── AccordionTrigger ─────────────────────────────────────────────────── */

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      leadingIcon,
      leadingNumber,
      leadingLogo,
      badge,
      hideChevron = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const { toggle } = useAccordionContext();
    const { value, isOpen, disabled, triggerId, contentId } = useAccordionItemContext();

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => toggle(value)}
        className={cn(
          "flex items-center gap-3 px-4 py-6 w-full text-left transition-colors",
          !isOpen && !disabled && "hover:bg-grey-50 dark:hover:bg-grey-100",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {leadingNumber && (
          <span className="shrink-0 flex items-center justify-center bg-grey-700 text-white text-base font-medium leading-[1.48] rounded-xl px-2 py-1 min-w-[37px]">
            {leadingNumber}
          </span>
        )}
        {leadingLogo && <span className="shrink-0">{leadingLogo}</span>}
        {leadingIcon && (
          <span className="shrink-0 size-6 text-grey-500">{resolveIcon(leadingIcon, "md")}</span>
        )}

        <span className="flex-1 min-w-0 text-lg font-semibold text-grey-900 leading-[1.54]">
          {children}
        </span>

        {badge != null && (
          <span className="shrink-0 bg-primary-50 text-primary-400 text-sm font-medium rounded-full px-3 py-2 leading-[1.45]">
            {badge}
          </span>
        )}

        {!hideChevron && (
          <ChevronDown
            className={cn(
              "shrink-0 size-6 text-grey-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

/* ─── AccordionContent ─────────────────────────────────────────────────── */

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...rest }, ref) => {
    const { isOpen, triggerId, contentId } = useAccordionItemContext();

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn("px-4 pb-6 text-base text-grey-500 leading-[1.48]", className)}
            {...rest}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
