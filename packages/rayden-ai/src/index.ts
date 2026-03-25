/**
 * @raydenui/ai - AI compatibility layer for Rayden UI
 *
 * Provides machine-readable component manifests, design tokens,
 * composition rules, and layout recipes for AI code generation.
 */

// Re-export manifests
export * from "./manifests";

// Re-export tokens
export * from "./tokens";

// Re-export rules
export * from "./rules";

// Re-export recipes
export * from "./recipes";

// Version info
export const VERSION = "0.1.4";

// Package metadata
export const metadata = {
  name: "@raydenui/ai",
  version: VERSION,
  description: "AI compatibility layer for Rayden UI",
  uiPackage: "@raydenui/ui",
  figmaFileKey: "tUAP8Crure0g1eewihmYUp",
};
