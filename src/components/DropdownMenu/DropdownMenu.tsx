import {
  createContext,
  useContext,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { usePopupList } from "../../hooks/usePopupList";
import { cn } from "../../utils/cn";
import { useCollisionAwareSide } from "../../hooks/useCollisionAwareSide";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconSource } from "../Icon";

// ─── Context ──────────────────────────────────────────────────────
interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  close: (restoreFocus?: boolean) => void;
  onTriggerKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  onListKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
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
    const [open, setOpen] = useControllableValue(controlledOpen, defaultOpen, onOpenChange);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { close, onTriggerKeyDown, onListKeyDown } = usePopupList({
      open,
      setOpen,
      containerRef,
      triggerRef,
      listRef: contentRef,
      role: "menuitem",
    });

    return (
      <DropdownMenuContext.Provider
        value={{
          open,
          setOpen,
          triggerRef,
          contentRef,
          close,
          onTriggerKeyDown,
          onListKeyDown,
        }}
      >
        <div
          ref={(node) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          {...rest}
          className={cn("relative inline-flex", className)}
        >
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

// ─── DropdownMenuTrigger ──────────────────────────────────────────
export type DropdownMenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ onClick, onKeyDown, children, className, ...rest }, ref) => {
    const { open, setOpen, triggerRef, onTriggerKeyDown } = useDropdownMenuContext();

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
        onKeyDown={(event) => {
          onKeyDown?.(event);
          onTriggerKeyDown(event);
        }}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(!open);
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
    const { open, triggerRef, contentRef, onListKeyDown } = useDropdownMenuContext();
    // The menu always opened downward, so near the bottom edge it ran off-screen.
    const menuSide = useCollisionAwareSide("bottom", open, triggerRef, contentRef);

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
        onKeyDown={(event) => {
          onKeyDown?.(event);
          onListKeyDown(event);
        }}
        className={cn(
          "absolute z-50 min-w-[200px] overflow-hidden rounded-lg bg-surface py-1",
          "shadow-lg ring-1 ring-black/5",
          "animate-in fade-in-0 zoom-in-95",
          menuSide === "top" ? "bottom-full" : "top-full",
          align === "end" ? "right-0" : "left-0",
          className
        )}
        style={menuSide === "top" ? { marginBottom: sideOffset } : { marginTop: sideOffset }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

// ─── DropdownMenuGroup ────────────────────────────────────────────
export type DropdownMenuGroupProps = HTMLAttributes<HTMLDivElement>;

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
      <p className="text-body-sm font-semibold text-on-surface">{children}</p>
      {description && <p className="text-body-sm text-on-surface-muted">{description}</p>}
    </div>
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// ─── DropdownMenuItem ─────────────────────────────────────────────
export interface DropdownMenuItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> {
  /** Leading icon — accepts a registry name, static IconRecord, or ReactNode */
  icon?: IconSource;
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
    const { close } = useDropdownMenuContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      if (e.defaultPrevented) return;
      close(true);
      onSelect?.();
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
            ? "bg-grey-100 text-grey-500 cursor-not-allowed"
            : destructive
              ? "text-error-500 hover:bg-error-50 focus:bg-error-100"
              : "text-on-surface hover:bg-grey-50 focus:bg-grey-100",
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
export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} role="separator" className={cn("my-1 h-px bg-grey-100", className)} {...rest} />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
