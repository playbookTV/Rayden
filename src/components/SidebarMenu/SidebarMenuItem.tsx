import {
  forwardRef,
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";
import { Icon, type IconName } from "../Icon";
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
export interface SidebarMenuSubItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this sub-item */
  value: string;
  children: ReactNode;
}

export const SidebarMenuSubItem = forwardRef<
  HTMLButtonElement,
  SidebarMenuSubItemProps
>(({ value, children, className, ...rest }, ref) => {
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
});

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// ─── SidebarMenuItem ─────────────────────────────────────────────
export interface SidebarMenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique identifier for this item */
  value: string;
  /** Icon displayed to the left — accepts IconName string or ReactNode */
  icon?: ReactNode | IconName;
  /** Optional count badge displayed on the right */
  badge?: string | number;
  /** Disabled state */
  disabled?: boolean;
  children: ReactNode;
}

export const SidebarMenuItem = forwardRef<
  HTMLButtonElement,
  SidebarMenuItemProps
>(({ value, icon, badge, disabled = false, children, className, ...rest }, ref) => {
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

  // Collapsed mode: icon only
  if (collapsed) {
    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={() => {
          if (!disabled && !isExpandable) onSelect(value);
        }}
        title={typeof labelContent === "string" ? labelContent : undefined}
        className={cn(
          "flex size-11 cursor-pointer items-center justify-center rounded transition-colors",
          highlighted
            ? cn(ts.selectedBg, ts.selectedIcon)
            : cn(ts.defaultIcon, ts.hoverBg),
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...rest}
      >
        {resolvedIcon}
      </button>
    );
  }

  return (
    <div>
      <button
        ref={ref}
        type="button"
        role="menuitem"
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
          <span
            className={cn(
              "shrink-0",
              highlighted ? ts.selectedIcon : ts.defaultIcon
            )}
          >
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
            className={cn(
              "ml-1 shrink-0 transition-transform",
              highlighted ? ts.selectedIcon : ts.defaultIcon
            )}
          />
        )}
      </button>

      {/* Sub-menu */}
      {isExpandable && open && (
        <div className="mt-1">{subMenuContent}</div>
      )}
    </div>
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";
