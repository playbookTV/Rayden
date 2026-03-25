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

// Forms & Inputs
import buttonAnatomy from "./components/button.json";
import buttonGroupAnatomy from "./components/button-group.json";
import inputAnatomy from "./components/input.json";
import selectAnatomy from "./components/select.json";
import checkboxAnatomy from "./components/checkbox.json";
import radioAnatomy from "./components/radio.json";
import toggleAnatomy from "./components/toggle.json";
import chipAnatomy from "./components/chip.json";
import fileUploadAnatomy from "./components/file-upload.json";
import counterAnatomy from "./components/counter.json";
import sliderAnatomy from "./components/slider.json";
import datePickerAnatomy from "./components/date-picker.json";

// Navigation
import tabsAnatomy from "./components/tabs.json";
import breadcrumbAnatomy from "./components/breadcrumb.json";
import paginationAnatomy from "./components/pagination.json";
import sidebarMenuAnatomy from "./components/sidebar-menu.json";
import dropdownMenuAnatomy from "./components/dropdown-menu.json";
import stepperAnatomy from "./components/stepper.json";

// Data Display
import tableAnatomy from "./components/table.json";
import avatarAnatomy from "./components/avatar.json";
import avatarGroupAnatomy from "./components/avatar-group.json";
import activityFeedAnatomy from "./components/activity-feed.json";
import metricsCardAnatomy from "./components/metrics-card.json";
import iconAnatomy from "./components/icon.json";
import emptyStateAnatomy from "./components/empty-state.json";
import chartAnatomy from "./components/chart.json";

// Feedback
import alertAnatomy from "./components/alert.json";
import badgeAnatomy from "./components/badge.json";
import bannerAnatomy from "./components/banner.json";
import progressBarAnatomy from "./components/progress-bar.json";
import progressCircleAnatomy from "./components/progress-circle.json";
import spinnerAnatomy from "./components/spinner.json";
import tooltipAnatomy from "./components/tooltip.json";

// Layout
import accordionAnatomy from "./components/accordion.json";
import dividerAnatomy from "./components/divider.json";
import modalAnatomy from "./components/modal.json";

// Export registry
export const registry = componentsRegistry;

// Export individual anatomy specs
export const anatomySpecs = {
  // Forms & Inputs
  Button: buttonAnatomy,
  ButtonGroup: buttonGroupAnatomy,
  Input: inputAnatomy,
  Select: selectAnatomy,
  Checkbox: checkboxAnatomy,
  Radio: radioAnatomy,
  Toggle: toggleAnatomy,
  Chip: chipAnatomy,
  FileUpload: fileUploadAnatomy,
  Counter: counterAnatomy,
  Slider: sliderAnatomy,
  DatePicker: datePickerAnatomy,

  // Navigation
  Tabs: tabsAnatomy,
  Breadcrumb: breadcrumbAnatomy,
  Pagination: paginationAnatomy,
  SidebarMenu: sidebarMenuAnatomy,
  DropdownMenu: dropdownMenuAnatomy,
  Stepper: stepperAnatomy,

  // Data Display
  Table: tableAnatomy,
  Avatar: avatarAnatomy,
  AvatarGroup: avatarGroupAnatomy,
  ActivityFeed: activityFeedAnatomy,
  MetricsCard: metricsCardAnatomy,
  Icon: iconAnatomy,
  EmptyState: emptyStateAnatomy,
  Chart: chartAnatomy,

  // Feedback
  Alert: alertAnatomy,
  Badge: badgeAnatomy,
  Banner: bannerAnatomy,
  ProgressBar: progressBarAnatomy,
  ProgressCircle: progressCircleAnatomy,
  Spinner: spinnerAnatomy,
  Tooltip: tooltipAnatomy,

  // Layout
  Accordion: accordionAnatomy,
  Divider: dividerAnatomy,
  Modal: modalAnatomy,
} as const;

export type AnatomyComponentName = keyof typeof anatomySpecs;

// Types for anatomy structure
export interface AnatomyNode {
  type:
    | "FRAME"
    | "TEXT"
    | "INSTANCE"
    | "RECTANGLE"
    | "ELLIPSE"
    | "GROUP"
    | "POLYGON"
    | "PATH"
    | "ARC";
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  layoutAlign?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "BASELINE";
  layoutGrow?: number;
  itemSpacing?: string;
  paddingHorizontal?: string;
  paddingVertical?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  padding?: string;
  cornerRadius?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeSide?: "ALL" | "TOP" | "RIGHT" | "BOTTOM" | "LEFT" | "LEFT_RIGHT" | "TOP_BOTTOM";
  strokeDashPattern?: number[];
  strokeCap?: "NONE" | "ROUND" | "SQUARE";
  opacity?: number;
  shadow?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string | number;
  textTransform?: string;
  textAlignHorizontal?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical?: "TOP" | "CENTER" | "BOTTOM";
  optional?: boolean;
  defaultVisible?: boolean;
  swapProperty?: string;
  size?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  overflow?: "visible" | "hidden" | "scroll";
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
  category?: string;
  variants?: string[] | null;
  appearances?: string[];
  types?: string[];
  sizes?: string[] | null;
  states?: string[];
  statuses?: string[];
  orientations?: string[];
  positions?: string[];
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
 * Get components by category.
 */
export function getComponentsByCategory(category: string): RegistryComponent[] {
  return registry.components.filter((c) => c.category === category);
}

/**
 * Get all unique categories.
 */
export function getCategories(): string[] {
  const categories = new Set(registry.components.map((c) => c.category).filter(Boolean));
  return Array.from(categories) as string[];
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
  if (entry.orientations && entry.orientations.length > 0) {
    dimensions.push({ name: "Orientation", values: entry.orientations });
  }
  if (entry.positions && entry.positions.length > 0) {
    dimensions.push({ name: "Position", values: entry.positions });
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
  const order = [
    "Variant",
    "Type",
    "Appearance",
    "Size",
    "State",
    "Status",
    "Orientation",
    "Position",
  ];
  for (const key of order) {
    if (combination[key]) {
      parts.push(combination[key]);
    }
  }

  return parts.join("/");
}
