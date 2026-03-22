import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";

export type TabsVariant = "line" | "pill" | "segmented";
export type TabsSize = "sm" | "md" | "lg";
export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  registerTab: (value: string, element: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be used within Tabs");
  return ctx;
}

export interface TabsProps {
  variant?: TabsVariant;
  size?: TabsSize;
  orientation?: TabsOrientation;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  variant = "line",
  size = "sm",
  orientation = "horizontal",
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value ?? internalValue;
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const onSelect = useCallback(
    (val: string) => {
      if (value === undefined) setInternalValue(val);
      onValueChange?.(val);
    },
    [value, onValueChange]
  );

  const registerTab = useCallback((tabValue: string, element: HTMLButtonElement | null) => {
    if (element) {
      tabsRef.current.set(tabValue, element);
    } else {
      tabsRef.current.delete(tabValue);
    }
  }, []);

  const isVertical = orientation === "vertical";
  const arrowNext = isVertical ? "ArrowDown" : "ArrowRight";
  const arrowPrev = isVertical ? "ArrowUp" : "ArrowLeft";

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(tabsRef.current.entries())
      .filter(([, el]) => !el.disabled)
      .map(([val, el]) => ({ value: val, element: el }));

    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((t) => t.element === document.activeElement);
    let nextIndex: number;

    switch (e.key) {
      case arrowNext:
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case arrowPrev:
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab) {
      nextTab.element.focus();
      onSelect(nextTab.value);
    }
  };

  const contextValue = useMemo(
    () => ({ activeValue, onSelect, variant, size, orientation, registerTab }),
    [activeValue, onSelect, variant, size, orientation, registerTab]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "inline-flex",
          isVertical ? "flex-col" : "",
          variant === "line" && !isVertical && "border-b border-grey-200",
          variant === "line" && isVertical && "border-r border-grey-200",
          variant === "pill" && (isVertical ? "gap-1" : "gap-1"),
          variant === "segmented" &&
            "border border-grey-100 rounded-lg p-0.5 gap-0.5 overflow-hidden",
          className
        )}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}
