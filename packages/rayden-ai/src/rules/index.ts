/**
 * Rules
 *
 * Composition rules, alias mappings, and validation helpers
 * for correct Rayden UI usage.
 */

import compositionRules from "./composition.json";
import aliasMappings from "./aliases.json";
import { componentExists, resolveAlias, publicContracts, type PropContract } from "../manifests";

// Export raw data
export const composition = compositionRules;
export const aliases = aliasMappings;

// Types
export type CompoundComponentName = keyof typeof compositionRules.compounds;

// Get composition rules for a compound component
export function getCompositionRules(componentName: string) {
  return compositionRules.compounds[componentName as CompoundComponentName] ?? null;
}

// Get related pair patterns
export function getRelatedPair(pair: string) {
  return compositionRules.relatedPairs[pair as keyof typeof compositionRules.relatedPairs] ?? null;
}

// Resolve a component alias to the real component name
export function resolveComponentAlias(alias: string): string | null {
  return resolveAlias(alias);
}

// Check if a component name is in the "does not exist" list
export function componentDoesNotExist(name: string): boolean {
  return !componentExists(name) && aliasMappings.doesNotExist.includes(name);
}

// Resolve a prop alias to the correct prop
export function resolvePropAlias(propName: string): string | null {
  const mapping = aliasMappings.propAliases[propName as keyof typeof aliasMappings.propAliases];
  if (mapping === undefined) return null;
  return mapping;
}

// Get common mistakes for a component
export function getCommonMistakes(componentName: string) {
  const mistakes = aliasMappings.commonMistakes.find((m) => m.component === componentName);
  return mistakes?.mistakes ?? [];
}

// Get HTML to component replacements
export function getHtmlReplacements() {
  return aliasMappings.htmlReplacements;
}

// Validate component nesting
export function validateNesting(
  parentComponent: string,
  childComponent: string
): { valid: boolean; message?: string } {
  // Check all compound component rules
  for (const [, rules] of Object.entries(compositionRules.compounds)) {
    const structure = (
      rules as { structure?: Record<string, { parent?: string | string[]; children?: string[] }> }
    ).structure;
    if (!structure) continue;

    const childRule = structure[childComponent];
    if (!childRule) continue;

    // Check if parent is valid
    const validParents = childRule.parent;
    if (!validParents) continue;

    const parentList = Array.isArray(validParents) ? validParents : [validParents];

    // null in parent list means it can be a top-level component
    if (parentList.includes(null as unknown as string)) {
      return { valid: true };
    }

    if (!parentList.includes(parentComponent)) {
      return {
        valid: false,
        message: `${childComponent} must be a child of ${parentList.join(" or ")}, not ${parentComponent}`,
      };
    }

    return { valid: true };
  }

  // No specific rule found, allow by default
  return { valid: true };
}

// Get required children for a compound component
export function getRequiredChildren(componentName: string): string[] {
  const rules = compositionRules.compounds[componentName as CompoundComponentName];
  if (!rules) return [];
  return (rules as { requiredChildren?: string[] }).requiredChildren ?? [];
}

// Validation examines a structured usage description, not React source or runtime behavior.
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  notAssessed: string[];
}
function checkValue(value: unknown, contract: PropContract): "valid" | "invalid" | "unassessed" {
  if (value && typeof value === "object" && "$expression" in value) return "unassessed";
  if (contract.type === "union") {
    const results = (contract.alternatives ?? []).map((c) => checkValue(value, c));
    return results.includes("valid")
      ? "valid"
      : results.includes("unassessed")
        ? "unassessed"
        : "invalid";
  }
  if (contract.type === "enum")
    return contract.values?.includes(value as string) ? "valid" : "invalid";
  if (contract.type === "null") return value === null ? "valid" : "invalid";
  if (contract.type === "array") return Array.isArray(value) ? "unassessed" : "invalid";
  if (contract.type === "object")
    return value !== null && typeof value === "object" ? "unassessed" : "invalid";
  if (["string", "number", "boolean", "function"].includes(contract.type)) {
    return typeof value === contract.type && (contract.type !== "number" || Number.isFinite(value))
      ? "valid"
      : "invalid";
  }
  return "unassessed";
}
export function validateComponentUsage(
  componentName: string,
  props: Record<string, unknown>,
  children?: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const notAssessed: string[] = [
    "Runtime accessibility, event behavior, and arbitrary React source are not assessed.",
  ];
  const result = () => ({ valid: errors.length === 0, errors, warnings, notAssessed });
  const resolved = resolveAlias(componentName);
  if (!resolved) {
    errors.push(
      `Unknown or ambiguous component "${componentName}". Use component discovery for supported names.`
    );
    return result();
  }
  const contract = publicContracts[resolved];
  if (!contract) {
    errors.push(
      `"${resolved}" is a family, not an importable component. Look up its named exports.`
    );
    return result();
  }
  if (resolved !== componentName)
    errors.push(`"${componentName}" is not a public export. Use "${resolved}" instead.`);
  if (!props || typeof props !== "object" || Array.isArray(props)) {
    errors.push("Props must be an object.");
    return result();
  }
  if (
    children !== undefined &&
    (!Array.isArray(children) || children.some((c) => typeof c !== "string"))
  ) {
    errors.push("Children must be an array of component names.");
    return result();
  }
  for (const [name, definition] of Object.entries(contract.props)) {
    if (
      definition.required &&
      props[name] === undefined &&
      !(name === "children" && children !== undefined)
    )
      errors.push(`${resolved} requires prop "${name}".`);
  }
  for (const [name, value] of Object.entries(props)) {
    if (value === undefined) continue;
    const definition = contract.props[name] ?? contract.inheritedPropTypes[name];
    if (definition) {
      const checked = checkValue(value, definition);
      if (checked === "invalid")
        errors.push(
          `${resolved}.${name} expects ${definition.typeText ?? definition.type}${definition.values ? ` (${definition.values.join(", ")})` : ""}.`
        );
      if (checked === "unassessed")
        notAssessed.push(
          `${resolved}.${name}: dynamic value or complex structure is not fully assessed.`
        );
    } else if (
      contract.inheritedProps.includes(name) ||
      name === "key" ||
      /^data-[\w.-]+$/.test(name)
    ) {
      if (
        /^on[A-Z]/.test(name) &&
        typeof value !== "function" &&
        !(value && typeof value === "object" && "$expression" in value)
      )
        errors.push(`${resolved}.${name} expects an event handler.`);
      else
        notAssessed.push(
          `${resolved}.${name}: inherited/platform attribute value and forwarding are not assessed.`
        );
    } else {
      const replacement = resolvePropAlias(name);
      errors.push(
        `Unsupported prop "${name}" on ${resolved}.${replacement ? ` Suggested spelling: ${replacement}; verify this component's contract.` : ""}`
      );
    }
  }
  if (children === undefined)
    notAssessed.push("Child structure is not supplied; composition is not assessed.");
  else {
    for (const child of getRequiredChildren(resolved))
      if (!children.includes(child))
        warnings.push(`${resolved} normally includes ${child}; confirm the intended composition.`);
    for (const child of children) {
      const nested = validateNesting(resolved, child);
      if (!nested.valid) errors.push(nested.message!);
      if (/^[A-Z]/.test(child) && !componentExists(child))
        errors.push(`Unknown child component "${child}".`);
    }
    notAssessed.push(
      "Composition checks cover supplied immediate children only; wrappers, ancestor context, and descendant requirements are not assessed."
    );
  }
  return result();
}
