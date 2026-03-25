/**
 * Component Anatomy Specs
 *
 * Defines the Figma layer structure for each Rayden UI component.
 * Used by AI agents to build components in Figma via use_figma.
 *
 * Architecture:
 * - anatomy/components.json is the registry of all component specs
 * - anatomy/components/*.json contain individual component anatomy
 * - Tokens are referenced as "{group.key}" and resolved against tokens.dtcg.json
 */

import componentsRegistry from "./components.json";
import buttonAnatomy from "./components/button.json";
import inputAnatomy from "./components/input.json";
import badgeAnatomy from "./components/badge.json";
import avatarAnatomy from "./components/avatar.json";

// Export registry
export const registry = componentsRegistry;

// Export individual anatomy specs
export const anatomySpecs = {
  Button: buttonAnatomy,
  Input: inputAnatomy,
  Badge: badgeAnatomy,
  Avatar: avatarAnatomy,
} as const;

export type AnatomyComponentName = keyof typeof anatomySpecs;

// Types for anatomy structure
export interface AnatomyNode {
  type: "FRAME" | "TEXT" | "INSTANCE" | "RECTANGLE" | "ELLIPSE" | "GROUP";
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  layoutAlign?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "BASELINE";
  itemSpacing?: string;
  paddingHorizontal?: string;
  paddingVertical?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  cornerRadius?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlignHorizontal?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical?: "TOP" | "CENTER" | "BOTTOM";
  optional?: boolean;
  defaultVisible?: boolean;
  swapProperty?: string;
  size?: number;
  children?: string[];
  [key: string]: unknown;
}

export interface ComponentProperty {
  name: string;
  type: "VARIANT" | "INSTANCE_SWAP" | "BOOLEAN" | "TEXT";
  values?: string[];
  default?: unknown;
}

export interface AnatomySpec {
  $schema?: string;
  name: string;
  figmaName: string;
  description?: string;
  $relationships?: {
    depends_on?: string[];
  };
  anatomy: Record<string, AnatomyNode>;
  sizes?: Record<string, Record<string, unknown>>;
  variants: Record<string, Record<string, Record<string, unknown>>>;
  statuses?: Record<string, Record<string, unknown>>;
  componentProperties: ComponentProperty[];
}

export interface RegistryComponent {
  name: string;
  file: string;
  figmaName: string;
  variants?: string[] | null;
  appearances?: string[];
  types?: string[];
  sizes?: string[] | null;
  states?: string[];
  statuses?: string[];
}

export interface Registry {
  $schema: string;
  version: string;
  description: string;
  components: RegistryComponent[];
}

/**
 * Get the anatomy spec for a component by name.
 */
export function getAnatomy(componentName: string): AnatomySpec | null {
  const spec = anatomySpecs[componentName as AnatomyComponentName];
  return spec ? (spec as unknown as AnatomySpec) : null;
}

/**
 * Get all available component names from the registry.
 */
export function getAvailableComponents(): string[] {
  return registry.components.map((c) => c.name);
}

/**
 * Get registry entry for a component.
 */
export function getRegistryEntry(componentName: string): RegistryComponent | null {
  return registry.components.find((c) => c.name === componentName) ?? null;
}

/**
 * Check if a component has an anatomy spec.
 */
export function hasAnatomy(componentName: string): boolean {
  return componentName in anatomySpecs;
}

/**
 * Get dependencies for a component (other components that must be loaded first).
 */
export function getDependencies(componentName: string): string[] {
  const spec = getAnatomy(componentName);
  return spec?.$relationships?.depends_on ?? [];
}

/**
 * Resolve all dependencies for a component recursively.
 * Returns components in load order (dependencies first).
 */
export function resolveDependencyTree(componentName: string): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function visit(name: string) {
    if (visited.has(name)) return;
    visited.add(name);

    const deps = getDependencies(name);
    for (const dep of deps) {
      visit(dep);
    }

    result.push(name);
  }

  visit(componentName);
  return result;
}

/**
 * Get all variant combinations for a component.
 * Returns array of objects like { Variant: "Primary", Appearance: "Solid", State: "Default" }
 */
export function getVariantCombinations(componentName: string): Array<Record<string, string>> {
  const entry = getRegistryEntry(componentName);
  if (!entry) return [];

  const combinations: Array<Record<string, string>> = [];

  // Get all dimension arrays
  const dimensions: Array<{ name: string; values: string[] }> = [];

  if (entry.variants && entry.variants.length > 0) {
    dimensions.push({ name: "Variant", values: entry.variants });
  }
  if (entry.appearances && entry.appearances.length > 0) {
    dimensions.push({ name: "Appearance", values: entry.appearances });
  }
  if (entry.types && entry.types.length > 0) {
    dimensions.push({ name: "Type", values: entry.types });
  }
  if (entry.sizes && entry.sizes.length > 0) {
    dimensions.push({ name: "Size", values: entry.sizes });
  }
  if (entry.states && entry.states.length > 0) {
    dimensions.push({ name: "State", values: entry.states });
  }
  if (entry.statuses && entry.statuses.length > 0) {
    dimensions.push({ name: "Status", values: entry.statuses });
  }

  // Generate all combinations
  function generateCombinations(index: number, current: Record<string, string>) {
    if (index === dimensions.length) {
      combinations.push({ ...current });
      return;
    }

    const dim = dimensions[index];
    for (const value of dim.values) {
      current[dim.name] = value;
      generateCombinations(index + 1, current);
    }
  }

  if (dimensions.length > 0) {
    generateCombinations(0, {});
  }

  return combinations;
}

/**
 * Generate Figma component name from variant combination.
 * Format: ComponentName/Variant/Appearance/Size/State
 */
export function generateFigmaName(
  componentName: string,
  combination: Record<string, string>
): string {
  const parts = [componentName];

  // Add in standard order
  const order = ["Variant", "Type", "Appearance", "Size", "State", "Status"];
  for (const key of order) {
    if (combination[key]) {
      parts.push(combination[key]);
    }
  }

  return parts.join("/");
}
