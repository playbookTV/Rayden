<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.postimg.cc/L8Cf5Hbj/Mac-Book-Air-18.png">
  <source media="(prefers-color-scheme: light)" srcset="https://i.postimg.cc/L8Cf5Hbj/Mac-Book-Air-18.png">
  <img alt="Rayden AI - AI compatibility layer for Rayden UI. Supercharge your LLMs to reliably generate UI components without hallucination." src="https://i.postimg.cc/L8Cf5Hbj/Mac-Book-Air-18.png" width="100%">
</picture>

<p align="center">
  <a href="https://www.npmjs.com/package/@raydenui/ai"><img src="https://img.shields.io/npm/v/@raydenui/ai?style=flat-square&color=F56630&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@raydenui/ai"><img src="https://img.shields.io/npm/dm/@raydenui/ai?style=flat-square&color=667185&label=downloads" alt="npm downloads"></a>
  <a href="https://github.com/raydenui/rayden"><img src="https://img.shields.io/github/stars/raydenui/rayden?style=flat-square&color=F56630" alt="GitHub stars"></a>
  <a href="https://github.com/raydenui/rayden/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@raydenui/ai?style=flat-square&color=099137" alt="license"></a>
  <img src="https://img.shields.io/badge/MCP-compatible-8B5CF6?style=flat-square" alt="MCP compatible">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
</p>

# @raydenui/ai

AI compatibility layer for Rayden UI — enables LLMs to reliably generate UI components without hallucination.

## Installation

```bash
# Run directly with npx (no install needed)
npx @raydenui/ai

# Or install globally
npm install -g @raydenui/ai
```

## What It Does

This package provides an MCP (Model Context Protocol) server that gives AI assistants structured access to:

- **Component Manifests** — Props, variants, and usage examples for all 33 Rayden UI components
- **Component Anatomy** — Figma layer structure for building components in Figma via `use_figma`
- **Design Tokens** — Colors, spacing, typography, shadows in JSON and W3C DTCG format
- **Layout Recipes** — Pre-built patterns for common UI scenarios (dashboards, forms, marketing pages)
- **Anti-hallucination Rules** — Constraints that prevent AI from inventing non-existent props or patterns
- **Skills** — Claude Code skills for specialized workflows (e.g., Figma component building)

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_components` | List all components, optionally filtered by category |
| `get_component_props` | Get detailed props, examples, and rules for a specific component |
| `get_tokens` | Retrieve design tokens (colors, spacing, typography, etc.) |
| `get_layout_recipes` | Get pre-built layout patterns for common UI scenarios |

## Claude Desktop Integration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "rayden-ai": {
      "command": "npx",
      "args": ["@raydenui/ai"]
    }
  }
}
```

## Claude Code Integration

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "rayden-ai": {
      "command": "npx",
      "args": ["@raydenui/ai"]
    }
  }
}
```

## Programmatic Usage

You can also import the component manifests and tokens directly:

```typescript
import { getComponentManifest, getAllManifests } from '@raydenui/ai/manifests';
import { tokens } from '@raydenui/ai/tokens';
import { recipes } from '@raydenui/ai/recipes';

// Get all component definitions
const manifests = getAllManifests();

// Get a specific component
const buttonManifest = getComponentManifest('Button');

// Access design tokens
console.log(tokens.colors.primary);
```

## Component Anatomy (Figma Integration)

For building components in Figma via `use_figma`, use the anatomy module:

```typescript
import { getAnatomy, getAvailableComponents, registry } from '@raydenui/ai/anatomy';

// Get Figma layer structure for a component
const buttonAnatomy = getAnatomy('Button');

// List all components with anatomy specs
const components = getAvailableComponents();

// Get components by category
import { getComponentsByCategory } from '@raydenui/ai/anatomy';
const formComponents = getComponentsByCategory('Forms & Inputs');
```

## Design Tokens

Tokens are available in two formats:

```typescript
// Standard JSON format
import { tokens } from '@raydenui/ai/tokens';

// W3C Design Tokens Community Group (DTCG) format
import dtcgTokens from '@raydenui/ai/tokens/dtcg';
```

## Skills (Claude Code)

Include skills in your Claude Code context for specialized workflows:

```typescript
// Figma component building skill
import skill from '@raydenui/ai/skills/rayden-use';
```

The `rayden-use` skill provides instructions for building Rayden UI components directly in Figma using the `use_figma` MCP tool.

## CLI Options

```bash
npx @raydenui/ai          # Start MCP server (stdio transport)
npx @raydenui/ai --help   # Show help message
```

## Exports

| Export | Description |
|--------|-------------|
| `@raydenui/ai` | Main entry with manifests, tokens, recipes, rules |
| `@raydenui/ai/manifests` | Component prop definitions |
| `@raydenui/ai/tokens` | Design tokens (JSON) |
| `@raydenui/ai/tokens/dtcg` | W3C DTCG format tokens |
| `@raydenui/ai/anatomy` | Figma layer structures |
| `@raydenui/ai/recipes` | Layout patterns |
| `@raydenui/ai/rules` | Composition rules |
| `@raydenui/ai/mcp` | MCP server handlers |
| `@raydenui/ai/RAYDEN_RULES.md` | Human-readable rules file |
| `@raydenui/ai/skills/rayden-use` | Figma component building skill |

## Related Packages

- [`@raydenui/ui`](https://www.npmjs.com/package/@raydenui/ui) — The React component library
- [Rayna UI Figma](https://www.figma.com/community/file/tUAP8Crure0g1eewihmYUp) — Design system source

## License

MIT
