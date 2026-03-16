/**
 * Rules
 *
 * Composition rules, alias mappings, and validation helpers
 * for correct Rayden UI usage.
 */

import compositionRules from "./composition.json";
import aliasMappings from "./aliases.json";

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
  const mapping =
    aliasMappings.componentAliases[alias as keyof typeof aliasMappings.componentAliases];
  if (mapping === undefined) return null;
  return mapping;
}

// Check if a component name is in the "does not exist" list
export function componentDoesNotExist(name: string): boolean {
  return aliasMappings.doesNotExist.includes(name);
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

// Validate a component usage
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateComponentUsage(
  componentName: string,
  props: Record<string, unknown>,
  children?: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if component exists
  if (componentDoesNotExist(componentName)) {
    errors.push(`Component "${componentName}" does not exist in Rayden UI`);
    return { valid: false, errors, warnings };
  }

  // Check for aliased component name
  const resolved = resolveComponentAlias(componentName);
  if (resolved && resolved !== componentName) {
    warnings.push(`Use "${resolved}" instead of "${componentName}"`);
  }

  // Check for aliased props
  for (const propName of Object.keys(props)) {
    const resolvedProp = resolvePropAlias(propName);
    if (resolvedProp === null) {
      warnings.push(`Prop "${propName}" is not supported`);
    } else if (resolvedProp !== propName) {
      warnings.push(`Use "${resolvedProp}" instead of "${propName}"`);
    }
  }

  // Check required children for compound components
  const requiredChildren = getRequiredChildren(componentName);
  if (requiredChildren.length > 0 && children) {
    for (const required of requiredChildren) {
      if (!children.includes(required)) {
        errors.push(`${componentName} requires ${required} as a child`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
