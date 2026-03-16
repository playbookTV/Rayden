/**
 * Handler for get_components tool
 */

import { components } from "../../manifests/index.js";
import type { GetComponentsInput, ComponentSummary } from "../types.js";

export function handleGetComponents(input: GetComponentsInput) {
  const { category } = input;

  let componentList: ComponentSummary[];

  if (category) {
    // Filter by category
    componentList = components.components
      .filter((c) => c.category === category)
      .map((c) => ({
        name: c.name,
        displayName: c.displayName,
        description: c.description,
        category: c.category,
        hasSubComponents: c.hasSubComponents ?? false,
      }));
  } else {
    // Return all components
    componentList = components.components.map((c) => ({
      name: c.name,
      displayName: c.displayName,
      description: c.description,
      category: c.category,
      hasSubComponents: c.hasSubComponents ?? false,
    }));
  }

  // Also include list of components that DON'T exist
  const doesNotExist = components.doesNotExist;

  const response = {
    totalComponents: componentList.length,
    components: componentList,
    categories: components.categories,
    doesNotExist: doesNotExist,
    note: "Use get_component_props to get detailed props for a specific component",
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
