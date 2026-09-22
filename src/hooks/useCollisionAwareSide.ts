import { useCallback, useEffect, useState, type RefObject } from "react";

export type AnchorSide = "top" | "right" | "bottom" | "left";

const OPPOSITE: Record<AnchorSide, AnchorSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Does the panel fit between the trigger and the viewport edge on this side? */
function fits(
  side: AnchorSide,
  trigger: DOMRect,
  panel: DOMRect,
  margin: number,
  viewport: Window
): boolean {
  switch (side) {
    case "top":
      return trigger.top - panel.height - margin >= 0;
    case "bottom":
      return trigger.bottom + panel.height + margin <= viewport.innerHeight;
    case "left":
      return trigger.left - panel.width - margin >= 0;
    case "right":
      return trigger.right + panel.width + margin <= viewport.innerWidth;
  }
}

/**
 * Resolve which side an anchored panel should actually open on.
 *
 * Fixed side classes put panels off-screen near a viewport edge — a tooltip anchored
 * at the top rendered above the visible area, and a listbox near the bottom opened
 * past it. This flips to the opposite side when the preferred one does not fit and
 * the opposite one does, and re-measures on scroll and resize.
 *
 * Returns the preferred side unchanged until the panel has been measured, so the
 * first paint matches the caller's intent.
 */
export function useCollisionAwareSide(
  preferred: AnchorSide,
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  margin = 8
): AnchorSide {
  const [side, setSide] = useState<AnchorSide>(preferred);

  const measure = useCallback(() => {
    const trigger = triggerRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    const viewport = triggerRef.current?.ownerDocument.defaultView;
    if (!trigger || !panel || !viewport || panel.height === 0) return;
    const opposite = OPPOSITE[preferred];
    setSide(
      !fits(preferred, trigger, panel, margin, viewport) &&
        fits(opposite, trigger, panel, margin, viewport)
        ? opposite
        : preferred
    );
  }, [preferred, triggerRef, panelRef, margin]);

  useEffect(() => {
    if (!open) {
      setSide(preferred);
      return;
    }
    const viewport = triggerRef.current?.ownerDocument.defaultView;
    if (!viewport) return;
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (panelRef.current) observer?.observe(panelRef.current);
    viewport.addEventListener("scroll", measure, true);
    viewport.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      viewport.removeEventListener("scroll", measure, true);
      viewport.removeEventListener("resize", measure);
    };
  }, [open, preferred, measure, triggerRef, panelRef]);

  return side;
}
