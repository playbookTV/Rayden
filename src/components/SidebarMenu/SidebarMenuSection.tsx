import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { useSidebarMenuContext, sidebarThemeStyles } from "./SidebarMenu";

// ─── Types ────────────────────────────────────────────────────────
export interface SidebarMenuSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional section title, e.g. "MAIN MENU" */
  title?: string;
  /** Whether to show a divider below the section */
  showDivider?: boolean;
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────
export const SidebarMenuSection = forwardRef<HTMLDivElement, SidebarMenuSectionProps>(
  ({ title, showDivider = true, children, className, ...rest }, ref) => {
    const { collapsed, theme } = useSidebarMenuContext();
    const ts = sidebarThemeStyles[theme];

    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...rest}>
        {/* Section title */}
        {title && !collapsed && (
          <span
            className={cn(
              "mb-2 px-4 text-body-xs font-medium uppercase tracking-wider",
              ts.sectionTitle
            )}
          >
            {title}
          </span>
        )}

        {/* Menu items */}
        <div className="flex flex-col gap-1" role="menu">
          {children}
        </div>

        {/* Divider */}
        {showDivider && <div className={cn("mt-3 border-b", ts.divider)} />}
      </div>
    );
  }
);

SidebarMenuSection.displayName = "SidebarMenuSection";
