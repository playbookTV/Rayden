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

export type TabsVariant = "line" | "pill";

interface TabsContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
  variant: TabsVariant;
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
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  variant = "line",
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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(tabsRef.current.entries())
      .filter(([, el]) => !el.disabled)
      .map(([val, el]) => ({ value: val, element: el }));

    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((t) => t.element === document.activeElement);
    let nextIndex: number;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case "ArrowLeft":
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
    () => ({ activeValue, onSelect, variant, registerTab }),
    [activeValue, onSelect, variant, registerTab]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "inline-flex",
          variant === "line" ? "border-b border-grey-200" : "gap-1",
          className
        )}
        role="tablist"
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}
