import {
  Children,
  isValidElement,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useContext,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { SharedLayout } from "../../motion/SharedLayout";
import { useRaydenMotion } from "../../motion/MotionProvider";
import type { MotionOption } from "../../motion/presets";
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type TabsVariant = "line" | "pill" | "segmented";
export type TabsSize = "sm" | "md" | "lg";
export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  motion: MotionOption;
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
  /** Opt into a shared selection indicator; keyboard and selection remain immediate. */
  motion?: MotionOption;
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
  motion = false,
  variant = "line",
  size = "sm",
  orientation = "horizontal",
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const { preset } = useRaydenMotion(motion);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const enabledValues: string[] = [];
  function collect(nodes: ReactNode) {
    Children.forEach(nodes, (node) => {
      if (!isValidElement<{ value?: string; disabled?: boolean; children?: ReactNode }>(node))
        return;
      if (typeof node.props.value === "string") {
        if (!node.props.disabled) enabledValues.push(node.props.value);
      } else if (node.props.children) collect(node.props.children);
    });
  }
  collect(children);
  const requestedValue = value ?? internalValue;
  const activeValue = enabledValues.includes(requestedValue)
    ? requestedValue
    : (enabledValues[0] ?? "");
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

  useBrowserLayoutEffect(() => {
    const list = listRef.current;
    if (!motion || !list) return;
    const measure = () => {
      const selected = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(
        (tab) => tab.getAttribute("aria-selected") === "true"
      );
      if (!selected) {
        setIndicator(null);
        return;
      }
      const base = {
        left: selected.offsetLeft,
        top: selected.offsetTop,
        width: selected.offsetWidth,
        height: selected.offsetHeight,
      };
      if (variant === "line") {
        if (isVertical) {
          base.left += base.width - 2;
          base.width = 2;
        } else {
          base.top += base.height - 2;
          base.height = 2;
        }
      }
      setIndicator((previous) =>
        previous &&
        Object.keys(base).every(
          (key) => base[key as keyof typeof base] === previous[key as keyof typeof base]
        )
          ? previous
          : base
      );
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(list);
    Array.from(list.children).forEach((child) => observer?.observe(child));
    return () => observer?.disconnect();
  }, [activeValue, motion, variant, size, isVertical, children]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(tabsRef.current.entries())
      .filter(([, el]) => !el.disabled)
      .sort((a, b) =>
        a[1].compareDocumentPosition(b[1]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
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
    () => ({ activeValue, onSelect, variant, size, orientation, registerTab, motion }),
    [activeValue, onSelect, variant, size, orientation, registerTab, motion]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        ref={listRef}
        data-rayden-motion={motion ? preset : undefined}
        className={cn(
          "inline-flex",
          motion && "relative isolate",
          isVertical ? "flex-col" : "",
          variant === "line" && !isVertical && "border-b border-grey-200",
          variant === "line" && isVertical && "border-r border-grey-200",
          variant === "pill" && (isVertical ? "gap-1" : "gap-1"),
          variant === "segmented" &&
            "border border-grey-100 bg-grey-50 rounded-lg p-0.5 gap-0.5 overflow-hidden",
          className
        )}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
      >
        {motion && indicator && (
          <SharedLayout
            aria-hidden="true"
            data-rayden-tab-indicator=""
            motion={motion}
            layoutKey={`${activeValue}:${indicator.left}:${indicator.top}:${indicator.width}:${indicator.height}`}
            className={cn(
              "pointer-events-none absolute",
              variant === "line" ? "bg-primary-400" : "bg-primary-50",
              variant === "pill" && "rounded-full",
              variant === "segmented" && "rounded-md"
            )}
            style={indicator}
          />
        )}
        {children}
      </div>
    </TabsContext.Provider>
  );
}
