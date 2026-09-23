"use client";

import { type CSSProperties, type HTMLAttributes } from "react";
import { useRaydenMotion } from "./MotionProvider";
import type { MotionOption } from "./presets";
export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  motion?: MotionOption;
}
/** Disclosure region. Supply an external trigger with aria-expanded and aria-controls. */
export function Collapse({ open, motion = true, children, style, ...props }: CollapseProps) {
  const { preset, tokens } = useRaydenMotion(motion);
  return (
    <div
      {...props}
      ref={(element) => {
        if (!element) return;
        if (!open && element.contains(document.activeElement)) {
          const trigger = element.id
            ? Array.from(document.querySelectorAll<HTMLElement>("[aria-controls]")).find(
                (candidate) =>
                  candidate.getAttribute("aria-controls")?.split(/\s+/).includes(element.id)
              )
            : undefined;
          if (trigger) trigger.focus({ preventScroll: true });
          else (document.activeElement as HTMLElement | null)?.blur();
        }
        element.toggleAttribute("inert", !open);
      }}
      data-rayden-collapse=""
      data-rayden-motion={preset}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open || props["aria-hidden"]}
      style={
        {
          "--rayden-motion-duration": `${open ? tokens.duration.normal : Math.round(tokens.duration.normal * 0.75)}ms`,
          "--rayden-motion-ease": open ? tokens.ease.enter : tokens.ease.exit,
          ...style,
        } as CSSProperties
      }
    >
      <div data-rayden-collapse-inner="">{children}</div>
    </div>
  );
}
