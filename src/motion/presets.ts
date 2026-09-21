/** Semantic, dependency-free motion metadata. Durations are milliseconds; distances are pixels. */
export type MotionPreset = "calm" | "snappy" | "playful" | "reduced";
export type MotionOption = boolean | MotionPreset;
export interface MotionTokens {
  duration: { instant: number; fast: number; normal: number; slow: number };
  ease: { enter: string; exit: string; standard: string };
  distance: { micro: number; short: number };
  scale: { press: number; enter: number };
}
const ease = {
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  standard: "cubic-bezier(0.25, 1, 0.5, 1)",
};
export const motionPresets: Record<MotionPreset, MotionTokens> = {
  calm: {
    duration: { instant: 0, fast: 100, normal: 220, slow: 280 },
    ease,
    distance: { micro: 2, short: 6 },
    scale: { press: 0.98, enter: 0.98 },
  },
  snappy: {
    duration: { instant: 0, fast: 80, normal: 140, slow: 180 },
    ease,
    distance: { micro: 2, short: 4 },
    scale: { press: 0.97, enter: 0.98 },
  },
  playful: {
    duration: { instant: 0, fast: 120, normal: 260, slow: 340 },
    ease,
    distance: { micro: 4, short: 12 },
    scale: { press: 0.95, enter: 0.94 },
  },
  reduced: {
    duration: { instant: 0, fast: 0, normal: 0, slow: 0 },
    ease,
    distance: { micro: 0, short: 0 },
    scale: { press: 1, enter: 1 },
  },
};

export const motionRecipes = {
  "appear.fade": {
    primitive: "Reveal",
    purpose: "Reveal content without displacement",
    reducedMotion: "Immediate visibility",
    engine: "waapi",
  },
  "appear.fadeUp": {
    primitive: "Reveal",
    purpose: "Introduce newly available content",
    reducedMotion: "Immediate visibility",
    engine: "waapi",
  },
  "appear.scale": {
    primitive: "Reveal",
    purpose: "Introduce a compact surface",
    reducedMotion: "Immediate visibility",
    engine: "waapi",
  },
  "overlay.pop": {
    primitive: "Modal",
    purpose: "Open or dismiss a dialog panel",
    reducedMotion: "Immediate open and close with focus preserved",
    engine: "waapi",
  },
  "selection.slideIndicator": {
    primitive: "SharedLayout",
    purpose: "Track tab selection",
    reducedMotion: "Immediate selection indicator",
    engine: "waapi",
  },
  "selection.sharedPill": {
    primitive: "SharedLayout",
    purpose: "Track segmented or pill selection",
    reducedMotion: "Immediate selection indicator",
    engine: "waapi",
  },
  "disclosure.collapse": {
    primitive: "Collapse",
    purpose: "Expand optional content",
    reducedMotion: "Immediate disclosure",
    engine: "css",
  },
  "feedback.press": {
    primitive: "Pressable",
    purpose: "Acknowledge pointer and keyboard press",
    reducedMotion: "Native focus and active state without scaling",
    engine: "css",
  },
} as const;
export type MotionRecipeName = keyof typeof motionRecipes;
export type RevealRecipe = "appear.fade" | "appear.fadeUp" | "appear.scale";
export function getMotionRecipe(name: MotionRecipeName, preset: MotionPreset = "calm") {
  return { name, ...motionRecipes[name], preset, tokens: motionPresets[preset] };
}
