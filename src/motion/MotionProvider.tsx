"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { motionPresets, type MotionOption, type MotionPreset } from "./presets";

const MotionContext = createContext<MotionPreset>("calm");
const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function snapshot() {
  return typeof window === "undefined" || !window.matchMedia || window.matchMedia(query).matches;
}
/** The server conservatively disables motion; hydration adopts the user's preference. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
export interface MotionProviderProps {
  preset?: MotionPreset;
  children: ReactNode;
}
/** Context-only scope: nested scopes and React portals inherit without mutating document root. */
export function MotionProvider({ preset, children }: MotionProviderProps) {
  const inherited = useContext(MotionContext);
  return <MotionContext.Provider value={preset ?? inherited}>{children}</MotionContext.Provider>;
}
/** Passing false disables this element's motion. OS reduced motion always wins. */
export function useRaydenMotion(option: MotionOption = true) {
  const inherited = useContext(MotionContext);
  const prefersReduced = useReducedMotionPreference();
  const requestedPreset = typeof option === "string" ? option : inherited;
  const preset = prefersReduced || option === false ? "reduced" : requestedPreset;
  return {
    requestedPreset,
    preset,
    reducedMotion: preset === "reduced",
    tokens: motionPresets[preset],
  };
}
