"use client";

import { useRef, type HTMLAttributes } from "react";
import { useMotionPresence } from "./presence";
import type { MotionOption, RevealRecipe } from "./presets";
export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  present?: boolean;
  motion?: MotionOption;
  recipe?: RevealRecipe;
}
/** Presence for non-interactive content; exiting content is inert immediately. */
export function Reveal({
  present = true,
  motion = true,
  recipe = "appear.fadeUp",
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useMotionPresence(present, ref, motion, recipe);
  if (!state.present) return null;
  return (
    <div
      {...props}
      ref={(element) => {
        ref.current = element;
        // DOM attribute works in both React 18 and 19 (React 18 lacks boolean inert support).
        element?.toggleAttribute("inert", !present);
      }}
      data-rayden-motion={state.preset}
      data-state={present ? "open" : "closed"}
      aria-hidden={!present || props["aria-hidden"]}
    >
      {children}
    </div>
  );
}
