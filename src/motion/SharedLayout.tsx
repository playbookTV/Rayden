"use client";

import { useEffect, useLayoutEffect, useRef, type HTMLAttributes } from "react";
import { useRaydenMotion } from "./MotionProvider";
import type { MotionOption } from "./presets";
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
export interface SharedLayoutProps extends HTMLAttributes<HTMLDivElement> {
  layoutKey: string | number;
  motion?: MotionOption;
}
/** FLIP animation of this persistent element's geometry when layoutKey changes. Not cross-tree presence. */
export function SharedLayout({ layoutKey, motion = true, children, ...props }: SharedLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef<DOMRect | null>(null);
  const animation = useRef<Animation | null>(null);
  const { preset, tokens } = useRaydenMotion(motion);
  useBrowserLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Continue interrupted movement from its current visual position, not the old target.
    let last = previous.current;
    if (animation.current && last) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      last = new DOMRect(
        last.x + matrix.m41,
        last.y + matrix.m42,
        last.width * matrix.a,
        last.height * matrix.d
      );
    }
    animation.current?.cancel();
    animation.current = null;
    const next = element.getBoundingClientRect();
    previous.current = next;
    if (!last || preset === "reduced" || !next.width || !next.height || !element.animate) return;
    const running = element.animate(
      [
        {
          transform: `translate(${last.x - next.x}px, ${last.y - next.y}px) scale(${last.width / next.width}, ${last.height / next.height})`,
          transformOrigin: "0 0",
        },
        { transform: "none", transformOrigin: "0 0" },
      ],
      { duration: tokens.duration.normal, easing: tokens.ease.standard }
    );
    animation.current = running;
    running.onfinish = () => {
      previous.current = element.getBoundingClientRect();
      animation.current = null;
    };
  }, [layoutKey, preset, tokens]);
  useEffect(() => () => animation.current?.cancel(), []);
  return (
    <div {...props} ref={ref} data-rayden-motion={preset}>
      {children}
    </div>
  );
}
