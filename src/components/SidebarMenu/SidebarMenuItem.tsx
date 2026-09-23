import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { Icon, type IconSource } from "../Icon";
import { resolveIcon } from "../../utils/resolveIcon";
import { useSidebarMenuContext, sidebarThemeStyles } from "./SidebarMenu";

// ─── SidebarMenuSub (wrapper for nested sub-items) ───────────────
export interface SidebarMenuSubProps {
  children: ReactNode;
}

export function SidebarMenuSub({ children }: SidebarMenuSubProps) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

SidebarMenuSub.displayName = "SidebarMenuSub";

// ─── SidebarMenuSubItem ──────────────────────────────────────────
export interface SidebarMenuSubItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this sub-item */
  value: string;
  children: ReactNode;
}

export const SidebarMenuSubItem = forwardRef<HTMLButtonElement, SidebarMenuSubItemProps>(
  ({ value, children, className, ...rest }, ref) => {
    const { activeValue, onSelect, theme } = useSidebarMenuContext();
    const isActive = activeValue === value;
    const ts = sidebarThemeStyles[theme];

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        onClick={() => onSelect(value)}
        className={cn(
          "flex w-full cursor-pointer items-center rounded py-3 pl-12 pr-4 text-left text-body-sm transition-colors",
          isActive
            ? cn(ts.selectedBg, "font-medium", ts.selectedText)
            : cn(ts.defaultText, ts.hoverBg),
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// ─── SidebarMenuItem ─────────────────────────────────────────────
export interface SidebarMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this item */
  value: string;
  /** Icon displayed to the left — accepts IconName string or ReactNode */
  icon?: IconSource;
  /** Optional count badge displayed on the right */
  badge?: string | number;
  /** Disabled state */
  disabled?: boolean;
  /**
   * Accessible name used when the sidebar is collapsed to icons. Required when
   * `children` is not a plain string, since a ReactNode cannot become a name.
   */
  label?: string;
  children: ReactNode;
}

export const SidebarMenuItem = forwardRef<HTMLButtonElement, SidebarMenuItemProps>(
  ({ value, icon, badge, disabled = false, label, children, className, ...rest }, ref) => {
    const { activeValue, onSelect, collapsed, theme } = useSidebarMenuContext();
    const ts = sidebarThemeStyles[theme];
    const isActive = activeValue === value;

    // Detect if this item has a SidebarMenuSub child (expandable)
    let labelContent: ReactNode = null;
    let subMenuContent: ReactNode = null;

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === SidebarMenuSub) {
        subMenuContent = child;
      } else {
        labelContent = child;
      }
    });

    const isExpandable = subMenuContent !== null;
    const [open, setOpen] = useState(false);

    // Check if any sub-item is active (to keep parent highlighted)
    let hasActiveSub = false;
    if (isExpandable && isValidElement(subMenuContent)) {
      Children.forEach(
        (subMenuContent as React.ReactElement<SidebarMenuSubProps>).props.children,
        (child) => {
          if (
            isValidElement(child) &&
            (child.props as SidebarMenuSubItemProps).value === activeValue
          ) {
            hasActiveSub = true;
          }
        }
      );
    }

    const highlighted = isActive || hasActiveSub;

    const handleClick = () => {
      if (disabled) return;
      if (isExpandable) {
        setOpen((prev) => !prev);
      } else {
        onSelect(value);
      }
    };

    const resolvedIcon = resolveIcon(icon, "md");

    // The collapsed rail scrolls (overflow-y-auto), which also clips horizontally, so
    // an absolutely positioned flyout is cut off. Render it in a portal anchored to the
    // trigger instead, and close it on outside pointer or Escape.
    const triggerRef = useRef<HTMLButtonElement>(null);
    const flyoutRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
    useEffect(() => setMounted(true), []);

    const place = useCallback(() => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setAnchor({ top: rect.top, left: rect.right + 8 });
    }, []);

    useLayoutEffect(() => {
      if (!collapsed || !open || !isExpandable) return;
      place();
      const onScroll = () => place();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      const onPointer = (event: PointerEvent) => {
        const target = event.target as Node;
        if (!triggerRef.current?.contains(target) && !flyoutRef.current?.contains(target))
          setOpen(false);
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        setOpen(false);
        triggerRef.current?.focus();
      };
      document.addEventListener("pointerdown", onPointer);
      document.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("pointerdown", onPointer);
        document.removeEventListener("keydown", onKey);
      };
    }, [collapsed, open, isExpandable, place]);

    // A collapsed item shows only an icon, so it needs an explicit name: an
    // element child such as <span>Home</span> cannot serve as one.
    const compactName = label ?? (typeof labelContent === "string" ? labelContent : undefined);

    // Collapsed mode: icon only, with nested destinations reachable via a flyout
    // rather than being dropped entirely.
    if (collapsed) {
      return (
        <div className="relative">
          <button
            ref={(node) => {
              triggerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            type="button"
            role="menuitem"
            disabled={disabled}
            onClick={handleClick}
            aria-label={compactName}
            aria-expanded={isExpandable ? open : undefined}
            aria-haspopup={isExpandable ? "menu" : undefined}
            className={cn(
              "flex size-11 cursor-pointer items-center justify-center rounded transition-colors",
              highlighted ? cn(ts.selectedBg, ts.selectedIcon) : cn(ts.defaultIcon, ts.hoverBg),
              disabled && "pointer-events-none opacity-50",
              className
            )}
            {...rest}
          >
            {resolvedIcon}
          </button>
          {isExpandable &&
            open &&
            mounted &&
            anchor &&
            createPortal(
              <div
                ref={flyoutRef}
                role="menu"
                aria-label={compactName}
                style={{ top: anchor.top, left: anchor.left }}
                className={cn(
                  "fixed z-50 min-w-[200px] rounded-lg p-2 shadow-soft-sm",
                  "border border-black/10 dark:border-white/15",
                  ts.container
                )}
              >
                {compactName && (
                  <p className={cn("px-3 pb-1 text-body-xs font-medium", ts.defaultText)}>
                    {compactName}
                  </p>
                )}
                {subMenuContent}
              </div>,
              document.body
            )}
        </div>
      );
    }

    return (
      <div>
        <button
          ref={ref}
          type="button"
          role="menuitem"
          aria-expanded={isExpandable ? open : undefined}
          aria-haspopup={isExpandable ? "menu" : undefined}
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            "flex w-full cursor-pointer items-center gap-1 rounded py-3 px-4 text-left text-body-sm transition-colors",
            highlighted
              ? cn(ts.selectedBg, ts.selectedBorder, "font-medium", ts.selectedText)
              : cn(ts.defaultText, ts.hoverBg),
            disabled && "pointer-events-none opacity-50",
            className
          )}
          {...rest}
        >
          {/* Icon */}
          {resolvedIcon && (
            <span className={cn("shrink-0", highlighted ? ts.selectedIcon : ts.defaultIcon)}>
              {resolvedIcon}
            </span>
          )}

          {/* Label */}
          <span className="flex-1 truncate">{labelContent}</span>

          {/* Badge */}
          {badge != null && (
            <span
              className={cn(
                "ml-auto shrink-0 rounded-[10px] px-2 text-body-xs font-medium",
                highlighted ? ts.badgeSelected : ts.badgeDefault
              )}
            >
              {badge}
            </span>
          )}

          {/* Expand chevron */}
          {isExpandable && (
            <Icon
              name={open ? "chevron-up" : "chevron-down"}
              size="sm"
              aria-hidden="true"
              className={cn(
                "ml-1 shrink-0 transition-transform",
                highlighted ? ts.selectedIcon : ts.defaultIcon
              )}
            />
          )}
        </button>

        {/* Sub-menu */}
        {isExpandable && open && <div className="mt-1">{subMenuContent}</div>}
      </div>
    );
  }
);

SidebarMenuItem.displayName = "SidebarMenuItem";
