"use client";

import {
  forwardRef,
  useState,
  useEffect,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";
import { useRaydenMotion } from "./MotionProvider";
import type { MotionOption } from "./presets";

export interface PressableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  motion?: MotionOption;
}
/** Native button semantics, focus and activation are retained; only press feedback is added. */
export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(function Pressable(
  {
    motion = true,
    type = "button",
    disabled,
    style,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
    ...props
  },
  ref
) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (disabled) setPressed(false);
  }, [disabled]);
  const { preset, tokens } = useRaydenMotion(motion);
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      data-rayden-motion={preset}
      data-rayden-pressable=""
      data-pressed={pressed && !disabled}
      style={
        {
          "--rayden-press-scale": tokens.scale.press,
          "--rayden-motion-fast": `${tokens.duration.fast}ms`,
          "--rayden-motion-ease": tokens.ease.standard,
          ...style,
        } as CSSProperties
      }
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented && !disabled && event.button === 0) setPressed(true);
      }}
      onPointerUp={(event) => {
        setPressed(false);
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        setPressed(false);
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        setPressed(false);
        onPointerLeave?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && !disabled && (event.key === " " || event.key === "Enter"))
          setPressed(true);
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") setPressed(false);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setPressed(false);
        onBlur?.(event);
      }}
    />
  );
});
