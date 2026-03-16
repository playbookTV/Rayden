/**
 * MCP Server Types
 */

// Tool input schemas
export interface GetComponentsInput {
  category?: string;
}

export interface GetComponentPropsInput {
  component: string;
}

export interface GetTokensInput {
  category?: "colors" | "spacing" | "typography" | "shadows" | "borderRadius" | "breakpoints";
}

export interface GetLayoutRecipesInput {
  category?: "marketing" | "dashboard" | "forms" | "content";
}

// Tool response types
export interface ComponentSummary {
  name: string;
  displayName: string;
  description: string;
  category: string;
  hasSubComponents: boolean;
}

export interface ComponentProps {
  name: string;
  props: Record<string, PropDefinition>;
  subComponents?: Record<string, { props: Record<string, PropDefinition> }>;
  examples?: Array<{ title: string; code: string }>;
  antiHallucination?: {
    aliases?: string[];
    doesNotExist?: string[];
    commonMistakes?: Array<{ mistake: string; correction: string }>;
  };
}

export interface PropDefinition {
  type: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  values?: string[];
}

export interface RecipeSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  components: string[];
}

export interface Recipe extends RecipeSummary {
  code: string;
  customizationPoints?: Array<{
    id: string;
    type: string;
    default: unknown;
    description: string;
  }>;
}

// MCP Tool definitions
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// MCP Response
export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
}
