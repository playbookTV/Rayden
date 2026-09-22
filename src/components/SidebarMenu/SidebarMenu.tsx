import {
  createContext,
  useCallback,
  useContext,
  useState,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";

// ─── Theme ────────────────────────────────────────────────────────
export type SidebarMenuTheme = "light" | "blue" | "dark-blue" | "dark-grey";

export const sidebarThemeStyles: Record<
  SidebarMenuTheme,
  {
    container: string;
    defaultText: string;
    defaultIcon: string;
    selectedBg: string;
    selectedText: string;
    selectedBorder: string;
    selectedIcon: string;
    hoverBg: string;
    sectionTitle: string;
    divider: string;
    badgeDefault: string;
    badgeSelected: string;
  }
> = {
  light: {
    container: "bg-surface",
    defaultText: "text-on-surface-body",
    defaultIcon: "text-on-surface-muted",
    selectedBg: "bg-primary-50",
    selectedText: "text-on-surface",
    selectedBorder: "border-l-2 border-primary-400",
    selectedIcon: "text-on-surface",
    hoverBg: "hover:bg-grey-50 dark:hover:bg-grey-100",
    sectionTitle: "text-on-surface-muted",
    divider: "border-grey-100",
    badgeDefault: "bg-grey-100 text-grey-700",
    badgeSelected: "bg-primary-50 text-action-primary-text",
  },
  blue: {
    container: "bg-[#1671D9]",
    defaultText: "text-white",
    defaultIcon: "text-white/70",
    selectedBg: "bg-[#0D5EBA]",
    selectedText: "text-white",
    selectedBorder: "",
    selectedIcon: "text-white",
    hoverBg: "hover:bg-[#0D5EBA]/50",
    sectionTitle: "text-[#B6D8FF]",
    divider: "border-[#80BBFF]",
    badgeDefault: "bg-grey-100 text-grey-700",
    badgeSelected: "bg-grey-100 text-grey-700",
  },
  "dark-blue": {
    container: "bg-[#04326B]",
    defaultText: "text-[#C6DDF7]",
    defaultIcon: "text-[#C6DDF7]/70",
    selectedBg: "bg-[#034592]",
    selectedText: "text-white",
    selectedBorder: "",
    selectedIcon: "text-white",
    hoverBg: "hover:bg-[#034592]/50",
    sectionTitle: "text-[#E3EFFC]",
    divider: "border-[#80BBFF]",
    badgeDefault: "bg-grey-100 text-grey-700",
    badgeSelected: "bg-grey-100 text-grey-700",
  },
  "dark-grey": {
    container: "bg-[#101928]",
    defaultText: "text-[#F0F2F5]",
    defaultIcon: "text-[#F0F2F5]/70",
    selectedBg: "bg-[#1D2739]",
    selectedText: "text-white",
    selectedBorder: "",
    selectedIcon: "text-white",
    hoverBg: "hover:bg-[#1D2739]/50",
    sectionTitle: "text-[#98A2B3]",
    divider: "border-[#344054]",
    badgeDefault: "bg-grey-100 text-grey-700",
    badgeSelected: "bg-grey-100 text-grey-700",
  },
};

// ─── Context ──────────────────────────────────────────────────────
export interface SidebarMenuContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
  collapsed: boolean;
  theme: SidebarMenuTheme;
}

const SidebarMenuContext = createContext<SidebarMenuContextValue | null>(null);

export function useSidebarMenuContext() {
  const ctx = useContext(SidebarMenuContext);
  if (!ctx) throw new Error("SidebarMenuItem / SidebarMenuSection must be used within SidebarMenu");
  return ctx;
}

// ─── Props ────────────────────────────────────────────────────────
export interface SidebarMenuProps extends HTMLAttributes<HTMLElement> {
  /** Controlled active item value */
  value?: string;
  /** Uncontrolled default active item */
  defaultValue?: string;
  /** Called when active item changes */
  onValueChange?: (value: string) => void;
  /** Collapsed icon-only mode (82 px wide) */
  collapsed?: boolean;
  /** Color theme */
  theme?: SidebarMenuTheme;
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────
export const SidebarMenu = forwardRef<HTMLElement, SidebarMenuProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      collapsed = false,
      theme = "light",
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const activeValue = value ?? internalValue;

    const onSelect = useCallback(
      (val: string) => {
        if (value === undefined) setInternalValue(val);
        onValueChange?.(val);
      },
      [value, onValueChange]
    );

    const ts = sidebarThemeStyles[theme];

    return (
      <SidebarMenuContext.Provider value={{ activeValue, onSelect, collapsed, theme }}>
        <nav
          ref={ref}
          aria-label="Main navigation"
          className={cn(
            "flex flex-col gap-3 overflow-y-auto rounded-xl py-6",
            ts.container,
            collapsed ? "w-[82px] items-center px-3" : "w-[272px] px-4",
            className
          )}
          {...rest}
        >
          {children}
        </nav>
      </SidebarMenuContext.Provider>
    );
  }
);

SidebarMenu.displayName = "SidebarMenu";
