import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconName } from "../Icon";

// ─── Context ──────────────────────────────────────────────────────
interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu compound components must be used within <DropdownMenu>");
  return ctx;
}

// ─── DropdownMenu (root) ──────────────────────────────────────────
export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open state */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    { open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...rest },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const setOpen = useCallback(
      (value: boolean) => {
        if (controlledOpen === undefined) setInternalOpen(value);
        onOpenChange?.(value);
      },
      [controlledOpen, onOpenChange]
    );

    // Click-outside handler
    useEffect(() => {
      if (!open) return;
      const handleMouseDown = (e: MouseEvent) => {
        const container = containerRef.current;
        if (container && !container.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleMouseDown);
      return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [open, setOpen]);

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
    }, [open, setOpen]);

    return (
      <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn("relative inline-flex", className)}
          {...rest}
        >
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

// ─── DropdownMenuTrigger ──────────────────────────────────────────
export interface DropdownMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ onClick, children, className, ...rest }, ref) => {
    const { open, setOpen, triggerRef } = useDropdownMenuContext();

    return (
      <button
        ref={(node) => {
          (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          setOpen(!open);
          onClick?.(e);
        }}
        className={className}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// ─── DropdownMenuContent ──────────────────────────────────────────
export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Alignment relative to trigger */
  align?: "start" | "end";
  /** Gap from trigger in px */
  sideOffset?: number;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ align = "end", sideOffset = 4, children, className, onKeyDown, ...rest }, ref) => {
    const { open, setOpen, triggerRef } = useDropdownMenuContext();
    const contentRef = useRef<HTMLDivElement>(null);

    // Focus first item on open
    useEffect(() => {
      if (!open) return;
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        const first = contentRef.current?.querySelector<HTMLButtonElement>(
          '[role="menuitem"]:not([disabled])'
        );
        first?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }, [open]);

    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      const items = Array.from(
        contentRef.current?.querySelectorAll<HTMLButtonElement>(
          '[role="menuitem"]:not([disabled])'
        ) ?? []
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

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="menu"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute top-full z-50 min-w-[200px] overflow-hidden rounded-lg bg-white dark:bg-grey-50 py-1",
          "shadow-lg ring-1 ring-black/5",
          "animate-in fade-in-0 zoom-in-95",
          align === "end" ? "right-0" : "left-0",
          className
        )}
        style={{ marginTop: sideOffset }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

// ─── DropdownMenuGroup ────────────────────────────────────────────
export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} role="group" className={cn("py-1", className)} {...rest} />
  )
);
DropdownMenuGroup.displayName = "DropdownMenuGroup";

// ─── DropdownMenuLabel ────────────────────────────────────────────
export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional description below the title */
  description?: string;
}

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ description, children, className, ...rest }, ref) => (
    <div ref={ref} className={cn("px-4 py-2", className)} {...rest}>
      <p className="text-body-sm font-semibold text-grey-900">{children}</p>
      {description && <p className="text-body-sm text-grey-500">{description}</p>}
    </div>
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// ─── DropdownMenuItem ─────────────────────────────────────────────
export interface DropdownMenuItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> {
  /** Leading icon — accepts a ReactNode or an IconName string */
  icon?: ReactNode | IconName;
  /** Keyboard shortcut label (e.g. "⌘C") */
  shortcut?: string;
  /** Whether this item is selected (shows check indicator) */
  selected?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Whether this is a destructive/dangerous action */
  destructive?: boolean;
  /** Called when the item is selected (click or Enter/Space) */
  onSelect?: () => void;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  (
    {
      icon,
      shortcut,
      selected = false,
      disabled = false,
      destructive = false,
      onSelect,
      onClick,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const { setOpen, triggerRef } = useDropdownMenuContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      onSelect?.();
      setOpen(false);
      // Return focus to trigger after closing
      setTimeout(() => triggerRef.current?.focus(), 0);
    };

    const resolvedIcon = resolveIcon(icon, "md");

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1 px-4 py-2 text-left text-body-sm outline-none transition-colors",
          disabled
            ? "bg-grey-100 text-grey-400 cursor-not-allowed"
            : destructive
              ? "text-error-500 hover:bg-error-50 focus:bg-error-100"
              : "text-grey-900 hover:bg-grey-50 focus:bg-grey-100",
          className
        )}
        {...rest}
      >
        <div className="flex flex-1 items-center gap-3">
          {resolvedIcon && (
            <span className={cn("shrink-0 size-5", disabled && "opacity-50")}>{resolvedIcon}</span>
          )}
          <span className="flex-1">{children}</span>
        </div>

        {shortcut && (
          <kbd className="ml-2 shrink-0 rounded bg-grey-50 border border-grey-100 px-1 text-body-sm text-grey-600">
            {shortcut}
          </kbd>
        )}

        {selected && (
          <span className="ml-2 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#1671D9]">
              <circle cx="8" cy="8" r="8" fill="currentColor" />
              <path
                d="M11.5 5.5L6.5 10.5L4.5 8.5"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

// ─── DropdownMenuSeparator ────────────────────────────────────────
export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} role="separator" className={cn("my-1 h-px bg-grey-100", className)} {...rest} />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
