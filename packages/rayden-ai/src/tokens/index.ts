/**
 * Design Tokens
 *
 * Complete design token export from Rayden UI including
 * colors, spacing, typography, shadows, and border radius.
 *
 * Architecture:
 * - tokens.json is the ONLY hand-edited source file
 * - tokens.dtcg.json is ALWAYS generated (via scripts/generate-dtcg.ts)
 * - Use the tokens/dtcg JSON subpath for the generated design-token format
 */

import tokensData from "./tokens.json";

// Export full tokens object
export const tokens = tokensData;

// Export individual token categories
export const colors = tokensData.colors;
export const spacing = tokensData.spacing;
export const typography = tokensData.typography;
export const shadows = tokensData.shadows;
export const borderRadius = tokensData.borderRadius;
export const breakpoints = tokensData.breakpoints;

// Token types
export type ColorScale = keyof typeof colors;
export type SpacingScale = keyof typeof spacing.scale;
export type TypographyScale = keyof typeof typography.presets;
export type ShadowType = keyof typeof shadows;

// Helper to get a color value
export function getColor(scale: string, shade: string | number): string | null {
  const colorScale = (colors as Record<string, Record<string, { hex?: string }>>)[scale];
  if (!colorScale || typeof colorScale !== "object") return null;
  const shadeData = colorScale[String(shade)];
  if (!shadeData || typeof shadeData !== "object" || !("hex" in shadeData)) return null;
  return shadeData.hex ?? null;
}

// Helper to get Tailwind class for a color
export function getColorClass(scale: string, shade: string | number): string | null {
  const colorScale = (colors as Record<string, Record<string, { tailwind?: string }>>)[scale];
  if (!colorScale || typeof colorScale !== "object") return null;
  const shadeData = colorScale[String(shade)];
  if (!shadeData || typeof shadeData !== "object" || !("tailwind" in shadeData)) return null;
  return shadeData.tailwind ?? null;
}

// Helper to get spacing value
export function getSpacing(size: string | number): { px: string; rem: string } | null {
  const spacingData = (spacing.scale as Record<string, { px?: string; rem?: string }>)[
    String(size)
  ];
  if (!spacingData || typeof spacingData !== "object") return null;
  if (!("px" in spacingData) || !("rem" in spacingData)) return null;
  return { px: spacingData.px!, rem: spacingData.rem! };
}

// Helper to get typography preset
export function getTypography(preset: string): Record<string, unknown> | null {
  const typoData = (typography.presets as Record<string, Record<string, unknown>>)[preset];
  if (!typoData || typeof typoData !== "object") return null;
  return typoData;
}

// Helper to get shadow value
export function getShadow(type: "soft" | "hard", size: string): string | null {
  const shadowType = (shadows as Record<string, Record<string, { value?: string }>>)[type];
  if (!shadowType || typeof shadowType !== "object") return null;
  const shadowData = shadowType[size];
  if (!shadowData || typeof shadowData !== "object" || !("value" in shadowData)) return null;
  return shadowData.value ?? null;
}

/**
 * Get the path to the DTCG tokens file.
 * Use this for tools that need the DTCG format (Figma, Style Dictionary, etc.)
 *
 * Note: The DTCG file is generated at build time from tokens.json.
 * It lives in dist/tokens/tokens.dtcg.json after build.
 */
export function getDTCGTokensPath(): string {
  // This returns a path relative to the package root
  // Consumers should resolve this against the package location
  return "dist/tokens/tokens.dtcg.json";
}

/**
 * Resolve a DTCG token alias like "{color.primary.500}" to its value.
 * This is useful for Figma agents that need to resolve token references.
 */
export function resolveDTCGAlias(alias: string, dtcgTokens: Record<string, unknown>): unknown {
  const seen = new Set<string>();
  function find(object: unknown, path: string): unknown {
    if (!object || typeof object !== "object") return undefined;
    const record = object as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(record, path)) return record[path];
    for (const key of Object.keys(record))
      if (path.startsWith(key + ".")) {
        const found = find(record[key], path.slice(key.length + 1));
        if (found !== undefined) return found;
      }
    return undefined;
  }
  function resolve(reference: string): unknown {
    if (seen.has(reference)) return null;
    seen.add(reference);
    const found = find(dtcgTokens, reference.replace(/^\{/, "").replace(/\}$/, ""));
    if (!found || typeof found !== "object" || !("$value" in found)) return null;
    const value = (found as { $value: unknown }).$value;
    return typeof value === "string" && /^\{.+\}$/.test(value) ? resolve(value) : value;
  }
  return resolve(alias);
}

// Generate CSS custom properties for all tokens
export function generateCSSVariables(): string {
  const lines: string[] = [":root {"];

  // Colors
  for (const [scale, shades] of Object.entries(colors)) {
    if (typeof shades !== "object" || shades === null) continue;
    if ("hex" in shades && typeof shades.hex === "string") {
      lines.push(`  --color-${scale}: ${shades.hex};`);
      continue;
    }
    for (const [shade, data] of Object.entries(shades)) {
      if (typeof data === "object" && data !== null && "hex" in data) {
        lines.push(`  --color-${scale}-${shade}: ${(data as { hex: string }).hex};`);
      }
    }
  }

  // Spacing
  for (const [size, data] of Object.entries(spacing.scale)) {
    if (typeof data === "object" && data !== null && "px" in data) {
      lines.push(`  --spacing-${size.replace(/\./g, "-")}: ${(data as { px: string }).px};`);
    }
  }

  // Typography
  for (const [preset, data] of Object.entries(typography.presets)) {
    if (typeof data === "object" && data !== null && "size" in data) {
      const d = data as unknown as { size: string; lineHeight: number; fontWeight: number };
      lines.push(`  --font-size-${preset}: ${d.size};`);
      lines.push(`  --line-height-${preset}: ${d.lineHeight};`);
      lines.push(`  --font-weight-${preset}: ${d.fontWeight};`);
    }
  }

  // Border radius
  for (const [size, value] of Object.entries(borderRadius)) {
    lines.push(`  --radius-${size}: ${value.value};`);
  }

  lines.push("}");
  return lines.join("\n");
}
