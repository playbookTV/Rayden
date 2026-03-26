/**
 * Component Manifests
 *
 * Machine-readable descriptions of all Rayden UI components
 * including props, variants, composition rules, and anti-hallucination data.
 */

import componentsRegistry from "./components.json";
import schemaDefinition from "./schema.json";

// Individual component manifests
import alertManifest from "./Alert.json";
import avatarManifest from "./Avatar.json";
import badgeManifest from "./Badge.json";
import breadcrumbManifest from "./Breadcrumb.json";
import buttonManifest from "./Button.json";
import buttonGroupManifest from "./ButtonGroup.json";
import cardManifest from "./Card.json";
import checkboxManifest from "./Checkbox.json";
import chipManifest from "./Chip.json";
import dividerManifest from "./Divider.json";
import dropdownMenuManifest from "./DropdownMenu.json";
import emptyStateIllustrationManifest from "./EmptyStateIllustration.json";
import fileUploadManifest from "./FileUpload.json";
import iconManifest from "./Icon.json";
import inputManifest from "./Input.json";
import metricsCardManifest from "./MetricsCard.json";
import paginationManifest from "./Pagination.json";
import progressBarManifest from "./ProgressBar.json";
import progressCircleManifest from "./ProgressCircle.json";
import radioManifest from "./Radio.json";
import selectManifest from "./Select.json";
import sidebarMenuManifest from "./SidebarMenu.json";
import tableManifest from "./Table.json";
import tabsManifest from "./Tabs.json";
import toggleManifest from "./Toggle.json";
import tooltipManifest from "./Tooltip.json";

// Export schema
export const schema = schemaDefinition;

// Export component registry
export const components = componentsRegistry;

// Export individual manifests
export const manifests = {
  Alert: alertManifest,
  Avatar: avatarManifest,
  Badge: badgeManifest,
  Breadcrumb: breadcrumbManifest,
  Button: buttonManifest,
  ButtonGroup: buttonGroupManifest,
  Card: cardManifest,
  Checkbox: checkboxManifest,
  Chip: chipManifest,
  Divider: dividerManifest,
  DropdownMenu: dropdownMenuManifest,
  EmptyStateIllustration: emptyStateIllustrationManifest,
  FileUpload: fileUploadManifest,
  Icon: iconManifest,
  Input: inputManifest,
  MetricsCard: metricsCardManifest,
  Pagination: paginationManifest,
  ProgressBar: progressBarManifest,
  ProgressCircle: progressCircleManifest,
  Radio: radioManifest,
  Select: selectManifest,
  SidebarMenu: sidebarMenuManifest,
  Table: tableManifest,
  Tabs: tabsManifest,
  Toggle: toggleManifest,
  Tooltip: tooltipManifest,
} as const;

// Export manifest type
export type ComponentName = keyof typeof manifests;

// Helper to get a component manifest
export function getManifest(name: string) {
  return manifests[name as ComponentName] ?? null;
}

// Helper to get all component names
export function getComponentNames(): string[] {
  return Object.keys(manifests);
}

// Helper to get components by category
export function getComponentsByCategory(category: string) {
  return Object.values(manifests).filter((m) => (m as { category?: string }).category === category);
}

// Check if a component exists
export function componentExists(name: string): boolean {
  return name in manifests;
}

// Get the correct component name from an alias
export function resolveAlias(alias: string): string | null {
  // Check if it's already a valid component
  if (componentExists(alias)) {
    return alias;
  }

  // Check all manifests for aliases
  for (const [name, manifest] of Object.entries(manifests)) {
    const m = manifest as { antiHallucination?: { aliases?: string[] } };
    if (m.antiHallucination?.aliases?.includes(alias)) {
      return name;
    }
  }

  return null;
}
