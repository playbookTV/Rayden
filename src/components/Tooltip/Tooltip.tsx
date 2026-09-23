import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { useDismissableLayer } from "../../hooks/useDismissableLayer";
import { cn } from "../../utils/cn";
import { useCollisionAwareSide } from "../../hooks/useCollisionAwareSide";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type TooltipPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";
export type TooltipTheme = "light" | "dark";
export interface TooltipAction {
  label: string;
  onClick: () => void;
}
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  theme?: TooltipTheme;
  /** Legacy panel alignment; placement is the preferred trigger API. */
  position?: TooltipPosition;
  placement?: "top" | "right" | "bottom" | "left";
  content: ReactNode;
  children?: ReactElement;
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  primaryAction?: TooltipAction;
  secondaryAction?: TooltipAction;
}

/** With children, provides a hover/focus tooltip (or a click popover for actions).
 * Without children, retains the original standalone panel API. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      theme = "light",
      position = "top-left",
      placement,
      title,
      content,
      children,
      delay = 0,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      onClose,
      primaryAction,
      secondaryAction,
      className,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const [open, changeOpen] = useControllableValue(controlledOpen, defaultOpen, onOpenChange);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const wrapper = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const interactive = !!(onClose || primaryAction || secondaryAction);
    const preferredSide = (placement ?? position.split("-")[0]) as
      | "top"
      | "right"
      | "bottom"
      | "left";
    // Fixed side classes put the panel off-screen at a viewport edge; flip when the
    // preferred side does not fit.
    const side = useCollisionAwareSide(preferredSide, open, wrapper, panelRef);
    const setOpen = (next: boolean) => {
      clearTimeout(timer.current);
      changeOpen(next);
    };
    const close = () => {
      setOpen(false);
      if (children && interactive)
        wrapper.current?.querySelector<HTMLElement>("button, a[href], [tabindex]")?.focus();
      onClose?.();
    };
    useEffect(() => () => clearTimeout(timer.current), []);

    const hasPanel = !!children;

    // Focus the panel only on the closed -> open transition, never on a rerender.
    const wasOpen = useRef(false);
    useBrowserLayoutEffect(() => {
      if (open && !wasOpen.current && hasPanel && interactive) {
        panelRef.current?.focus();
      }
      wasOpen.current = open;
    }, [open, hasPanel, interactive]);

    useDismissableLayer({
      open: open && hasPanel,
      containerRef: wrapper,
      onDismiss: (reason) => {
        if (reason === "escape") close();
        else setOpen(false);
      },
    });

    const panel = (
      <div
        id={id}
        ref={panelRef}
        role={interactive ? "dialog" : "tooltip"}
        aria-label={interactive ? (title ?? "More information") : undefined}
        tabIndex={interactive ? -1 : undefined}
        className={cn(
          "flex max-w-[min(20rem,calc(100vw-2rem))] flex-col gap-4 rounded-lg border p-4 text-sm shadow-soft-sm",
          theme === "dark"
            ? "bg-tooltip-dark text-tooltip-dark-text border-tooltip-dark"
            : "bg-surface text-on-surface border-grey-200"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            {title && <p className="font-semibold">{title}</p>}
            <div>{content}</div>
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="rounded px-1 focus-visible:outline-2 focus-visible:outline-current"
            >
              ×
            </button>
          )}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {secondaryAction && (
              <button
                type="button"
                className="rounded font-semibold underline focus-visible:outline-2 focus-visible:outline-current"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                className="rounded font-semibold underline focus-visible:outline-2 focus-visible:outline-current"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
    const trigger = isValidElement<HTMLAttributes<HTMLElement>>(children)
      ? cloneElement(children, {
          ...(interactive
            ? {
                "aria-haspopup": "dialog" as const,
                "aria-expanded": open,
                "aria-controls": open ? id : undefined,
              }
            : {
                "aria-describedby":
                  [children.props["aria-describedby"], open ? id : undefined]
                    .filter(Boolean)
                    .join(" ") || undefined,
              }),
          onClick: (event) => {
            children.props.onClick?.(event);
            if (interactive && !event.defaultPrevented) setOpen(!open);
          },
        })
      : children;
    return (
      <div
        {...rest}
        ref={(node) => {
          wrapper.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative inline-flex", className)}
        onMouseEnter={(event) => {
          rest.onMouseEnter?.(event);
          if (children && !interactive) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setOpen(true), delay);
          }
        }}
        onMouseLeave={(event) => {
          rest.onMouseLeave?.(event);
          if (children && !interactive && !wrapper.current?.contains(document.activeElement))
            setOpen(false);
        }}
        onFocus={(event) => {
          rest.onFocus?.(event);
          if (children && !interactive) setOpen(true);
        }}
      >
        {trigger}
        {children
          ? open && (
              <div
                className={cn(
                  "absolute z-50 w-max max-w-[calc(100vw-2rem)]",
                  side === "top" && "bottom-full left-1/2 -translate-x-1/2 pb-2",
                  side === "bottom" && "top-full left-1/2 -translate-x-1/2 pt-2",
                  side === "left" && "right-full top-1/2 -translate-y-1/2 pr-2",
                  side === "right" && "left-full top-1/2 -translate-y-1/2 pl-2"
                )}
              >
                {panel}
              </div>
            )
          : panel}
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";
