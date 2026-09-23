import ApplicationShellBlockManifest from "./ApplicationShellBlock.json";
import PageHeaderBlockManifest from "./PageHeaderBlock.json";
import WorkspaceSwitcherBlockManifest from "./WorkspaceSwitcherBlock.json";
import CommandPaletteBlockManifest from "./CommandPaletteBlock.json";
/** Public component knowledge. Export mappings and prop contracts are generated from UI source. */
import registry from "./components.json";
import schemaDefinition from "./schema.json";
import generated from "./contracts.generated.json";
import aliasMappings from "../rules/aliases.json";
import m0 from "./Button.json";
import m1 from "./Badge.json";
import m2 from "./Icon.json";
import m3 from "./Divider.json";
import m4 from "./Tooltip.json";
import m5 from "./Input.json";
import m6 from "./Select.json";
import m7 from "./Checkbox.json";
import m8 from "./Radio.json";
import m9 from "./Toggle.json";
import m10 from "./Chip.json";
import m11 from "./Counter.json";
import m12 from "./Slider.json";
import m13 from "./DatePicker.json";
import m14 from "./Alert.json";
import m15 from "./Banner.json";
import m16 from "./ProgressBar.json";
import m17 from "./ProgressCircle.json";
import m18 from "./Spinner.json";
import m19 from "./Tabs.json";
import m20 from "./Breadcrumb.json";
import m21 from "./Pagination.json";
import m22 from "./SidebarMenu.json";
import m23 from "./Stepper.json";
import m24 from "./Table.json";
import m25 from "./Avatar.json";
import m26 from "./MetricsCard.json";
import m27 from "./EmptyStateIllustration.json";
import m28 from "./ActivityFeed.json";
import m29 from "./Chart.json";
import m30 from "./Accordion.json";
import m31 from "./Card.json";
import m32 from "./Modal.json";
import m33 from "./ButtonGroup.json";
import m34 from "./DropdownMenu.json";
import m35 from "./FileUpload.json";
export const schema = schemaDefinition;
export interface PropContract {
  type: string;
  typeText?: string;
  required?: boolean;
  description?: string;
  values?: Array<string | number | boolean>;
  alternatives?: PropContract[];
}
export interface ExportContract {
  name: string;
  importPath: string;
  sourceModule: string;
  props: Record<string, PropContract>;
  inheritedProps: string[];
  inheritedPropTypes: Record<string, PropContract>;
}
export const publicContracts = Object.fromEntries(
  Object.entries({ ...generated.exports, ...generated.motion.exports }).map(([name, contract]) => [
    name,
    {
      ...contract,
      inheritedPropTypes: Object.fromEntries(
        Object.entries(contract.inheritedPropTypes).map(([key, id]) => [
          key,
          (generated.platformTypes as Record<string, PropContract>)[id],
        ])
      ),
    },
  ])
) as unknown as Record<string, ExportContract>;
export const referenceContext = {
  schemaVersion: generated.schemaVersion,
  flavor: generated.flavor as "citrionus",
  uiVersion: generated.uiVersion,
  aiVersion: generated.aiVersion,
  assumptions: [
    "Citrionus reference data for the stated UI release; the consuming project's installed version has not been inspected.",
  ],
};
interface AuthoredManifest {
  name: string;
  description: string;
  category: string;
  props?: Record<string, { description?: string }>;
  subComponents?: Record<string, { props?: Record<string, { description?: string }> }>;
  antiHallucination?: { aliases?: string[] };
  examples?: Array<{ title: string; code: string }>;
}
export interface ResolvedManifest {
  name: string;
  family: string;
  kind: "component" | "family";
  category: string;
  description: string;
  importPath: string;
  exportNames: string[];
  props: Record<string, PropContract>;
  inheritedProps: string[];
  inheritedPropTypes: Record<string, PropContract>;
  subComponents: Record<string, ExportContract>;
  examples: Array<{ title: string; code: string }>;
  sizes?: Array<string | number | boolean>;
  antiHallucination?: { aliases: string[]; note: string };
  schemaVersion: string;
  flavor: "citrionus";
  uiVersion: string;
  aiVersion: string;
  assumptions: string[];
}
const authoredManifests = {
  ApplicationShellBlock: ApplicationShellBlockManifest,
  PageHeaderBlock: PageHeaderBlockManifest,
  WorkspaceSwitcherBlock: WorkspaceSwitcherBlockManifest,
  CommandPaletteBlock: CommandPaletteBlockManifest,

  Button: m0,
  Badge: m1,
  Icon: m2,
  Divider: m3,
  Tooltip: m4,
  Input: m5,
  Select: m6,
  Checkbox: m7,
  Radio: m8,
  Toggle: m9,
  Chip: m10,
  Counter: m11,
  Slider: m12,
  DatePicker: m13,
  Alert: m14,
  Banner: m15,
  ProgressBar: m16,
  ProgressCircle: m17,
  Spinner: m18,
  Tabs: m19,
  Breadcrumb: m20,
  Pagination: m21,
  SidebarMenu: m22,
  Stepper: m23,
  Table: m24,
  Avatar: m25,
  MetricsCard: m26,
  EmptyStateIllustration: m27,
  ActivityFeed: m28,
  RaydenChart: m29,
  Accordion: m30,
  Card: m31,
  Modal: m32,
  ButtonGroup: m33,
  DropdownMenu: m34,
  FileUpload: m35,
} as const;
export type ComponentName = keyof typeof authoredManifests;
export const componentFamilies = generated.families;
export const components = {
  ...registry,
  version: generated.uiVersion,
  components: registry.components.map((entry) => {
    const family = componentFamilies.find((f) => f.name === entry.name)!;
    return { ...entry, ...family, kind: entry.name === "ActivityFeed" ? "family" : "component" };
  }),
};
export function getComponentNames(): string[] {
  return componentFamilies.map((f) => f.name);
}
export function componentExists(name: string): boolean {
  return (
    Object.prototype.hasOwnProperty.call(publicContracts, name) ||
    componentFamilies.some((f) => f.name === name)
  );
}
export function resolveAlias(name: string): string | null {
  if (componentExists(name)) return name;
  if (name === "Chart") return "RaydenChart";
  const aliases = new Set<string>();
  const explicit = (aliasMappings.componentAliases as Record<string, string | null>)[name];
  if (explicit && componentExists(explicit)) aliases.add(explicit);
  for (const [canonical, manifest] of Object.entries(authoredManifests)) {
    if ((manifest as AuthoredManifest).antiHallucination?.aliases?.includes(name))
      aliases.add(canonical);
  }
  return aliases.size === 1 ? [...aliases][0] : null;
}
export function getManifest(name: string): ResolvedManifest | null {
  const resolved = resolveAlias(name);
  if (!resolved) return null;
  const motion = publicContracts[resolved];
  if (motion?.importPath === "@raydenui/ui/motion")
    return {
      ...motion,
      ...referenceContext,
      family: "Motion",
      kind: "component",
      category: "motion",
      description:
        resolved === "MotionProvider"
          ? "Context-only motion preset scope; system reduced-motion preferences always take precedence."
          : `Optional ${resolved} motion primitive. Consult catalog.motion for semantic recipes and constraints.`,
      exportNames: Object.keys(generated.motion.exports),
      subComponents: {},
      examples: [],
    };
  const family = componentFamilies.find(
    (f) => f.name === resolved || f.exportNames.includes(resolved)
  )!;
  const authored = authoredManifests[family.name as ComponentName] as AuthoredManifest;
  const contract = publicContracts[resolved];
  const sub = authored.subComponents?.[resolved];
  const props = contract
    ? Object.fromEntries(
        Object.entries(contract.props).map(([key, value]) => [
          key,
          {
            ...value,
            description:
              value.description || (sub?.props ?? authored.props)?.[key]?.description || "",
          },
        ])
      )
    : {};
  return {
    ...authored,
    name: resolved,
    family: family.name,
    kind: contract ? "component" : "family",
    importPath: family.importPath,
    exportNames: family.exportNames,
    props,
    inheritedProps: contract?.inheritedProps ?? [],
    inheritedPropTypes: contract?.inheritedPropTypes ?? {},
    subComponents: Object.fromEntries(
      family.exportNames.filter((n) => n !== resolved).map((n) => [n, publicContracts[n]])
    ),
    sizes: props.size?.values,
    antiHallucination: {
      aliases:
        authored.antiHallucination?.aliases?.filter((alias: string) => !componentExists(alias)) ??
        [],
      note: "Use source-derived props and inheritedProps as the supported contract. Authored examples are JSX fragments and may require imports, state, callbacks, and verification in your application.",
    },
    examples: resolved === family.name ? (authored.examples ?? []) : [],
    ...referenceContext,
  };
}
export function getComponentsByCategory(category: string) {
  return componentFamilies.map((f) => getManifest(f.name)).filter((m) => m?.category === category);
}

export const manifests = Object.fromEntries(
  componentFamilies.map((f) => [f.name, getManifest(f.name)])
) as Record<ComponentName, ResolvedManifest>;
