import { useCallback, useEffect, useState, type RefObject } from "react";

export type AnchorSide = "top" | "right" | "bottom" | "left";

const OPPOSITE: Record<AnchorSide, AnchorSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Does the panel fit between the trigger and the viewport edge on this side? */
function fits(side: AnchorSide, trigger: DOMRect, panel: DOMRect, margin: number): boolean {
  switch (side) {
    case "top":
      return trigger.top - panel.height - margin >= 0;
    case "bottom":
      return trigger.bottom + panel.height + margin <= window.innerHeight;
    case "left":
      return trigger.left - panel.width - margin >= 0;
    case "right":
      return trigger.right + panel.width + margin <= window.innerWidth;
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
    if (!trigger || !panel || panel.height === 0) return;
    const opposite = OPPOSITE[preferred];
    setSide(
      !fits(preferred, trigger, panel, margin) && fits(opposite, trigger, panel, margin)
        ? opposite
        : preferred
    );
  }, [preferred, triggerRef, panelRef, margin]);

  useEffect(() => {
    if (!open) {
      setSide(preferred);
      return;
    }
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, preferred, measure]);

  return side;
}
