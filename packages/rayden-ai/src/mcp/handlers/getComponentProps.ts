/**
 * Handler for get_component_props tool
 */

import { manifests, resolveAlias, componentExists } from "../../manifests/index.js";
import { resolveComponentAlias, componentDoesNotExist } from "../../rules/index.js";
import type { GetComponentPropsInput } from "../types.js";

export function handleGetComponentProps(input: GetComponentPropsInput) {
  const { component } = input;

  // Check if component is in the "does not exist" list
  if (componentDoesNotExist(component)) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: `Component "${component}" does not exist in Rayden UI`,
              suggestion: "Use get_components to see available components",
              alternatives: resolveComponentAlias(component)
                ? [`Consider using "${resolveComponentAlias(component)}" instead`]
                : [],
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Try to resolve alias
  const resolvedName = resolveAlias(component);
  if (!resolvedName) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: `Component "${component}" not found`,
              suggestion: "Use get_components to see available components",
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Get the manifest
  const manifest = manifests[resolvedName as keyof typeof manifests];
  if (!manifest) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: `Manifest for "${resolvedName}" not found`,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Build response
  const m = manifest as {
    name: string;
    displayName?: string;
    description: string;
    category: string;
    props: Record<string, unknown>;
    subComponents?: Record<string, unknown>;
    children?: unknown;
    composition?: unknown;
    accessibility?: unknown;
    antiHallucination?: {
      aliases?: string[];
      doesNotExist?: string[];
      commonMistakes?: Array<{ mistake: string; correction: string }>;
    };
    examples?: Array<{ title: string; code: string }>;
    sizes?: string[];
  };

  const response = {
    name: m.name,
    displayName: m.displayName ?? m.name,
    description: m.description,
    category: m.category,
    props: m.props,
    sizes: m.sizes,
    subComponents: m.subComponents,
    children: m.children,
    composition: m.composition,
    accessibility: m.accessibility,
    antiHallucination: m.antiHallucination,
    examples: m.examples,
    // Include alias info if the input was an alias
    ...(resolvedName !== component
      ? { note: `"${component}" is an alias for "${resolvedName}"` }
      : {}),
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}
