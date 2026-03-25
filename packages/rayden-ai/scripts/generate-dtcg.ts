#!/usr/bin/env tsx
/**
 * Generate W3C Design Tokens Community Group (DTCG) format
 *
 * This script transforms tokens.json (hand-maintained source) into
 * tokens.dtcg.json (W3C DTCG format for Figma and other tools).
 *
 * DTCG Spec: https://tr.designtokens.org/format/
 *
 * Architecture:
 * - tokens.json is the ONLY hand-edited token file
 * - tokens.dtcg.json is ALWAYS generated from tokens.json
 * - Never import from tokens.dtcg.json in this package
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_PATH = join(__dirname, "../src/tokens/tokens.json");
const DIST_DIR = join(__dirname, "../dist/tokens");
const OUTPUT_PATH = join(DIST_DIR, "tokens.dtcg.json");

interface SourceTokens {
  $schema?: string;
  version?: string;
  name?: string;
  description?: string;
  colors: Record<string, ColorScale>;
  spacing: {
    description?: string;
    base?: string;
    scale: Record<string, SpacingValue>;
  };
  typography: {
    fontFamily: Record<string, string[]>;
    presets: Record<string, TypographyPreset>;
  };
  shadows: Record<string, Record<string, ShadowValue>>;
  borderRadius: Record<string, BorderRadiusValue>;
  blur: Record<string, BlurValue>;
  breakpoints: Record<string, BreakpointValue>;
  componentTokens?: Record<string, unknown>;
}

interface ColorScale {
  description?: string;
  [shade: string]: { hex: string; tailwind: string; usage: string } | string | undefined;
}

interface SpacingValue {
  px: string;
  rem: string;
  usage?: string;
}

interface TypographyPreset {
  size: string;
  lineHeight: number;
  letterSpacing: string;
  fontWeight: number;
  textTransform?: string;
  tailwindClass?: string;
  usage?: string;
}

interface ShadowValue {
  value: string;
  tailwindClass?: string;
  usage?: string;
  description?: string;
}

interface BorderRadiusValue {
  value: string;
  tailwindClass?: string;
}

interface BlurValue {
  value: string;
  tailwindClass?: string;
}

interface BreakpointValue {
  value: string;
  description?: string;
}

// W3C DTCG format types
interface DTCGToken {
  $type?: string;
  $value: unknown;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

interface DTCGGroup {
  $type?: string;
  $description?: string;
  [key: string]: DTCGToken | DTCGGroup | string | undefined;
}

function convertToDTCG(source: SourceTokens): DTCGGroup {
  const dtcg: DTCGGroup = {
    $description: source.description || "Rayden UI Design Tokens (W3C DTCG format)",
  };

  // Convert colors
  dtcg.color = convertColors(source.colors);

  // Convert spacing
  dtcg.spacing = convertSpacing(source.spacing);

  // Convert typography
  dtcg.typography = convertTypography(source.typography);

  // Convert shadows
  dtcg.shadow = convertShadows(source.shadows);

  // Convert border radius
  dtcg.radius = convertBorderRadius(source.borderRadius);

  // Convert blur
  dtcg.blur = convertBlur(source.blur);

  // Convert breakpoints
  dtcg.breakpoint = convertBreakpoints(source.breakpoints);

  return dtcg;
}

function convertColors(colors: Record<string, ColorScale>): DTCGGroup {
  const group: DTCGGroup = {
    $type: "color",
  };

  for (const [scaleName, scale] of Object.entries(colors)) {
    const scaleGroup: DTCGGroup = {};

    if (scale.description) {
      scaleGroup.$description = scale.description;
    }

    for (const [shade, data] of Object.entries(scale)) {
      if (shade === "description") continue;
      if (typeof data === "object" && data !== null && "hex" in data) {
        scaleGroup[shade] = {
          $value: data.hex,
          $description: data.usage,
          $extensions: {
            "com.raydenui": {
              tailwind: data.tailwind,
            },
          },
        } as DTCGToken;
      }
    }

    group[scaleName] = scaleGroup;
  }

  return group;
}

function convertSpacing(spacing: SourceTokens["spacing"]): DTCGGroup {
  const group: DTCGGroup = {
    $type: "dimension",
    $description: spacing.description,
  };

  for (const [size, data] of Object.entries(spacing.scale)) {
    group[size] = {
      $value: data.px,
      $description: data.usage,
      $extensions: {
        "com.raydenui": {
          rem: data.rem,
        },
      },
    } as DTCGToken;
  }

  return group;
}

function convertTypography(typography: SourceTokens["typography"]): DTCGGroup {
  const group: DTCGGroup = {};

  // Font families
  group.fontFamily = {
    $type: "fontFamily",
  } as DTCGGroup;

  for (const [name, families] of Object.entries(typography.fontFamily)) {
    (group.fontFamily as DTCGGroup)[name] = {
      $value: families,
    } as DTCGToken;
  }

  // Typography presets as composite tokens
  group.preset = {} as DTCGGroup;

  for (const [name, preset] of Object.entries(typography.presets)) {
    (group.preset as DTCGGroup)[name] = {
      $type: "typography",
      $value: {
        fontFamily: "{typography.fontFamily.sans}",
        fontSize: preset.size,
        fontWeight: preset.fontWeight,
        lineHeight: preset.lineHeight,
        letterSpacing: preset.letterSpacing,
      },
      $description: preset.usage,
      $extensions: {
        "com.raydenui": {
          tailwindClass: preset.tailwindClass,
          textTransform: preset.textTransform,
        },
      },
    } as DTCGToken;
  }

  return group;
}

function convertShadows(shadows: Record<string, Record<string, ShadowValue>>): DTCGGroup {
  const group: DTCGGroup = {
    $type: "shadow",
  };

  for (const [type, sizes] of Object.entries(shadows)) {
    const typeGroup: DTCGGroup = {};

    if (typeof sizes === "object" && "description" in sizes) {
      typeGroup.$description = sizes.description as string;
    }

    for (const [size, data] of Object.entries(sizes)) {
      if (size === "description") continue;
      if (typeof data === "object" && "value" in data) {
        // Parse CSS shadow value into DTCG shadow format
        // For now, store as string - full parsing would require regex
        typeGroup[size] = {
          $value: data.value,
          $description: data.usage,
          $extensions: {
            "com.raydenui": {
              tailwindClass: data.tailwindClass,
            },
          },
        } as DTCGToken;
      }
    }

    group[type] = typeGroup;
  }

  return group;
}

function convertBorderRadius(borderRadius: Record<string, BorderRadiusValue>): DTCGGroup {
  const group: DTCGGroup = {
    $type: "dimension",
  };

  for (const [size, data] of Object.entries(borderRadius)) {
    group[size] = {
      $value: data.value,
      $extensions: {
        "com.raydenui": {
          tailwindClass: data.tailwindClass,
        },
      },
    } as DTCGToken;
  }

  return group;
}

function convertBlur(blur: Record<string, BlurValue>): DTCGGroup {
  const group: DTCGGroup = {
    $type: "dimension",
  };

  for (const [size, data] of Object.entries(blur)) {
    group[size] = {
      $value: data.value,
      $extensions: {
        "com.raydenui": {
          tailwindClass: data.tailwindClass,
        },
      },
    } as DTCGToken;
  }

  return group;
}

function convertBreakpoints(breakpoints: Record<string, BreakpointValue>): DTCGGroup {
  const group: DTCGGroup = {
    $type: "dimension",
  };

  for (const [name, data] of Object.entries(breakpoints)) {
    group[name] = {
      $value: data.value,
      $description: data.description,
    } as DTCGToken;
  }

  return group;
}

// Main execution
function main() {
  console.log("Generating W3C DTCG tokens...");

  // Read source tokens
  const sourceContent = readFileSync(SRC_PATH, "utf-8");
  const source: SourceTokens = JSON.parse(sourceContent);

  // Convert to DTCG format
  const dtcg = convertToDTCG(source);

  // Ensure output directory exists
  mkdirSync(DIST_DIR, { recursive: true });

  // Write output
  const output = JSON.stringify(dtcg, null, 2);
  writeFileSync(OUTPUT_PATH, output);

  console.log(`Generated: ${OUTPUT_PATH}`);
  console.log(`Token groups: color, spacing, typography, shadow, radius, blur, breakpoint`);
}

main();
