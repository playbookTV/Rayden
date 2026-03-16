/**
 * MCP Tool Definitions
 */

import type { ToolDefinition } from "./types";

export const tools: ToolDefinition[] = [
  {
    name: "get_components",
    description:
      "List all available Rayden UI components with their descriptions and categories. " +
      "Use this to discover what components exist before generating code. " +
      "Optionally filter by category: primitives, inputs, feedback, navigation, data-display, composite.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by component category",
          enum: ["primitives", "inputs", "feedback", "navigation", "data-display", "composite"],
        },
      },
    },
  },
  {
    name: "get_component_props",
    description:
      "Get detailed props, variants, examples, and anti-hallucination rules for a specific component. " +
      "ALWAYS call this before generating code for a component to ensure correct prop usage. " +
      "Returns: props with types and defaults, sub-components (for compound components), " +
      "code examples, and common mistakes to avoid.",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: 'Component name (e.g., "Button", "Table", "Input")',
        },
      },
      required: ["component"],
    },
  },
  {
    name: "get_tokens",
    description:
      "Get Rayden UI design tokens including colors, spacing, typography, shadows, and border radius. " +
      "Use these tokens via Tailwind classes (e.g., bg-primary-500, text-grey-700). " +
      "Optionally filter by category to get specific token types.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by token category",
          enum: ["colors", "spacing", "typography", "shadows", "borderRadius", "breakpoints"],
        },
      },
    },
  },
  {
    name: "get_layout_recipes",
    description:
      "Get pre-built layout recipes and patterns using Rayden UI components. " +
      "Recipes include complete code examples for common UI patterns like pricing pages, " +
      "dashboards, forms, and empty states. Filter by category to find relevant recipes.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by recipe category",
          enum: ["marketing", "dashboard", "forms", "content"],
        },
      },
    },
  },
];
