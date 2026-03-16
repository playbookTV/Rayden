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
    container: "bg-white",
    defaultText: "text-grey-700",
    defaultIcon: "text-grey-400",
    selectedBg: "bg-primary-50",
    selectedText: "text-grey-900",
    selectedBorder: "border-l-2 border-primary-400",
    selectedIcon: "text-grey-900",
    hoverBg: "hover:bg-grey-50",
    sectionTitle: "text-grey-400",
    divider: "border-grey-100",
    badgeDefault: "bg-grey-100 text-grey-700",
    badgeSelected: "bg-primary-75 text-primary-700",
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
    container: "bg-grey-900",
    defaultText: "text-grey-100",
    defaultIcon: "text-grey-100/70",
    selectedBg: "bg-grey-800",
    selectedText: "text-white",
    selectedBorder: "",
    selectedIcon: "text-white",
    hoverBg: "hover:bg-grey-800/50",
    sectionTitle: "text-grey-400",
    divider: "border-grey-700",
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
          role="navigation"
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
