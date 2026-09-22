import { useEffect, useLayoutEffect } from "react";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const locks = new WeakMap<HTMLElement, { count: number; overflow: string }>();

/** Restore the original style only after the last open modal releases its lock. */
export function useBodyScrollLock(locked: boolean) {
  useBrowserLayoutEffect(() => {
    if (!locked) return;
    const body = document.body;
    const lock = locks.get(body) ?? { count: 0, overflow: body.style.overflow };
    lock.count++;
    locks.set(body, lock);
    body.style.overflow = "hidden";
    return () => {
      if (--lock.count === 0) {
        body.style.overflow = lock.overflow;
        locks.delete(body);
      }
    };
  }, [locked]);
}
