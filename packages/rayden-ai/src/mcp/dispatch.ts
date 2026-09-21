import { tools } from "./tools";
import type {
  GetComponentsInput,
  GetComponentPropsInput,
  GetTokensInput,
  GetLayoutRecipesInput,
} from "./types";
import { handleGetComponents } from "./handlers/getComponents";
import { handleGetComponentProps } from "./handlers/getComponentProps";
import { handleGetTokens } from "./handlers/getTokens";
import { handleGetLayoutRecipes } from "./handlers/getLayoutRecipes";
import { getCatalog, getComponentGuidance } from "../catalog";
import { validateComponentUsage } from "../rules";
import { referenceContext } from "../manifests";
import { success, failure } from "./response";

export function callTool(name: string, input: unknown = {}) {
  try {
    const definition = tools.find((t) => t.name === name);
    if (!definition) return failure(`Unknown tool: ${name}`);
    if (!input || typeof input !== "object" || Array.isArray(input))
      return failure("Tool arguments must be an object.");
    const args = input as Record<string, unknown>;
    for (const required of definition.inputSchema.required ?? [])
      if (args[required] === undefined) return failure(`Missing required input: ${required}`);
    for (const [key, value] of Object.entries(args)) {
      const schema = definition.inputSchema.properties[key] as
        | { type: string; enum?: unknown[] }
        | undefined;
      if (!schema) return failure(`Unknown input: ${key}`);
      if (
        schema.type === "array"
          ? !Array.isArray(value) || value.some((v) => typeof v !== "string")
          : schema.type === "object"
            ? !value || typeof value !== "object" || Array.isArray(value)
            : typeof value !== schema.type
      )
        return failure(`Invalid input type for ${key}: expected ${schema.type}`);
      if (schema.type === "string" && !(value as string).trim())
        return failure(`${key} must not be empty.`);
      if (schema.enum && !schema.enum.includes(value))
        return failure(`Invalid ${key}; expected one of ${schema.enum.join(", ")}`);
    }
    if (args.flavor && args.flavor !== referenceContext.flavor)
      return failure(
        `Unsupported flavor ${args.flavor}; only Citrionus reference data is available.`
      );
    if (args.uiVersion && args.uiVersion !== referenceContext.uiVersion)
      return failure(
        `Unsupported UI version ${args.uiVersion}; this reference describes ${referenceContext.uiVersion}.`
      );
    switch (name) {
      case "get_components":
        return handleGetComponents(args as GetComponentsInput);
      case "get_component_props":
        return handleGetComponentProps(args as unknown as GetComponentPropsInput);
      case "get_tokens":
        return handleGetTokens(args as GetTokensInput);
      case "get_layout_recipes":
        return handleGetLayoutRecipes(args as GetLayoutRecipesInput);
      case "get_catalog":
        return success(getCatalog());
      case "get_component_guidance": {
        const guidance = getComponentGuidance(args.component as string);
        return guidance
          ? success(guidance)
          : failure(`Unknown or ambiguous component: ${args.component}`);
      }
      case "validate_component_usage":
        return success({
          ...referenceContext,
          ...validateComponentUsage(
            args.component as string,
            args.props as Record<string, unknown>,
            args.children as string[] | undefined
          ),
        });
      default:
        return failure(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return failure(
      `Tool execution failed: ${error instanceof Error ? error.message : "unknown error"}`
    );
  }
}
