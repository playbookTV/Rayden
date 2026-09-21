/** Flavor-aware reference catalog, shared by MCP, docs, and distribution tooling. */
import {
  componentFamilies,
  getManifest,
  referenceContext,
  resolveAlias,
  publicContracts,
} from "./manifests";
import { getCompositionRules } from "./rules";
import generated from "./manifests/contracts.generated.json";

export const capabilities = {
  componentDiscovery: true,
  componentProps: true,
  structuredUsageValidation: true,
  guidancePrompts: true,
  designTokens: true,
  layoutRecipes: true,
  figmaAnatomy: "package-subpath",
  installedProjectDetection: false,
  flavorSwitching: false,
  sourceCodeValidation: false,
  motionPilot: true,
} as const;

export function getComponentGuidance(name: string) {
  const resolved = resolveAlias(name);
  if (!resolved) return null;
  const component = getManifest(resolved)!;
  const imports = component.kind === "family" ? component.exportNames : [resolved];
  const required = Object.entries(component.props as (typeof publicContracts)[string]["props"])
    .filter(([, p]) => p.required)
    .map(([n]) => n);
  const enums = Object.entries(component.props as (typeof publicContracts)[string]["props"])
    .filter(([, p]) => p.type === "enum")
    .map(([n, p]) => `${n}: ${p.values!.map(String).join(" | ")}`);
  const composition = getCompositionRules(component.family);
  const prompt = [
    `Build with Rayden UI's free default Citrionus flavor, using reference UI ${referenceContext.uiVersion} and AI ${referenceContext.aiVersion}.`,
    `Use ${resolved}: ${component.description}`,
    `Import { ${imports.join(", ")} } from "${component.importPath}".`,
    component.kind === "family"
      ? `${resolved} is a family name, not an importable component; use its named exports.`
      : "",
    component.exportNames.length > 1
      ? `Family exports: ${component.exportNames.join(", ")}. Look up each export's own prop contract before using it.`
      : "",
    required.length ? `Required props: ${required.join(", ")}.` : "",
    enums.length ? `Supported enum values: ${enums.join("; ")}.` : "",
    composition ? `Composition guidance: ${JSON.stringify(composition)}` : "",
    "Preserve accessible labels, keyboard interaction, and reduced-motion preferences. Check the actual installed UI version before applying this reference.",
    "Validate structured component usage; validation cannot establish runtime accessibility, callback behavior, or correctness of arbitrary React code.",
  ]
    .filter(Boolean)
    .join("\n");
  return { ...component, compositionRules: composition, prompt, capabilities };
}

export function getCatalog() {
  return {
    ...referenceContext,
    capabilities,
    motion: {
      ...generated.motion,
      exports: Object.fromEntries(
        Object.keys(generated.motion.exports).map((name) => {
          const { inheritedPropTypes: _inheritedTypes, ...contract } = publicContracts[name];
          return [name, { ...contract, prompt: getComponentGuidance(name)!.prompt }];
        })
      ),
      defaultPreset: "calm",
      componentOptIn:
        "Tabs and Modal motion props default to false; pass true or a preset to enable.",
      reducedMotionPolicy:
        "System reduced-motion preference overrides provider and local preset choices.",
      limitations: [
        "SharedLayout animates one persistent node; cross-tree layout IDs and spring physics are not supported.",
      ],
    },
    limitations: [
      "Only the stated Citrionus UI release is represented; future flavors and other versions are not silently substituted.",
      "Prop contracts derive from exported TypeScript types. Types do not establish runtime defaults or behavior.",
      "Examples are authored JSX fragments; not every example has an end-to-end interaction test.",
      "Token and anatomy data are separately authored reference data; full parity with runtime CSS is not certified.",
    ],
    components: componentFamilies.map((family) => {
      const guidance = getComponentGuidance(family.name)!;
      // Discovery clients need custom props and supported names; detailed platform type
      // contracts remain available from per-component lookup instead of repeating them.
      const { inheritedPropTypes: _platformTypes, ...summary } = guidance;
      return {
        ...summary,
        subComponents: Object.fromEntries(
          Object.entries(
            guidance.subComponents as Record<string, (typeof publicContracts)[string]>
          ).map(([name, contract]) => {
            const { inheritedPropTypes: _inheritedTypes, ...part } = contract;
            return [name, part];
          })
        ),
      };
    }),
  };
}
