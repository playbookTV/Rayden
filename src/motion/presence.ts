"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useRaydenMotion } from "./MotionProvider";
import type { MotionOption, RevealRecipe } from "./presets";

/** Internal presence controller. Cancelled animations never complete an obsolete exit. */
export function useMotionPresence(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  motion: MotionOption = true,
  recipe: RevealRecipe | "overlay.pop" = "appear.fadeUp",
  ready = true
) {
  const { preset, tokens } = useRaydenMotion(motion);
  const [retained, setRetained] = useState(open);
  const animation = useRef<Animation | null>(null);
  const present = open || retained;
  useEffect(() => {
    const element = ref.current;
    if (!ready || !element) return;
    const currentStyle = animation.current ? getComputedStyle(element) : null;
    const from = currentStyle
      ? { opacity: currentStyle.opacity, transform: currentStyle.transform }
      : null;
    animation.current?.cancel();
    animation.current = null;
    setRetained(open);
    if (preset === "reduced" || typeof element.animate !== "function") return;
    if (!open) setRetained(true);
    const hidden = {
      opacity: 0,
      transform:
        recipe === "appear.fade"
          ? "none"
          : recipe === "appear.scale" || recipe === "overlay.pop"
            ? `scale(${tokens.scale.enter})`
            : `translateY(${tokens.distance.short}px)`,
    };
    const shown = { opacity: 1, transform: "none" };
    const running = element.animate([from ?? (open ? hidden : shown), open ? shown : hidden], {
      duration: open ? tokens.duration.normal : Math.round(tokens.duration.normal * 0.75),
      easing: open ? tokens.ease.enter : tokens.ease.exit,
      fill: "both",
    });
    animation.current = running;
    running.onfinish = () => {
      animation.current = null;
      running.cancel();
      if (!open) setRetained(false);
    };
    return () => {
      // Keep the current animation until the next effect can sample its visual state.
      running.onfinish = null;
    };
  }, [open, ready, preset, recipe, tokens, ref]);
  useEffect(
    () => () => {
      animation.current?.cancel();
    },
    []
  );
  return { present, preset };
}
