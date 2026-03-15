<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../public/MacBook Air - 18.png">
  <source media="(prefers-color-scheme: light)" srcset="../../public/MacBook Air - 18.png">
  <img alt="Rayden AI - AI compatibility layer for Rayden UI. Supercharge your LLMs to reliably generate UI components without hallucination." src="../../public/MacBook Air - 18.png" width="100%">
</picture>

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

- **Component definitions** — Props, variants, and usage examples for all 24+ Rayden UI components
- **Design tokens** — Colors, spacing, typography, shadows, and border radius values
- **Layout recipes** — Pre-built patterns for common UI scenarios (dashboards, forms, marketing pages)
- **Anti-hallucination rules** — Constraints that prevent AI from inventing non-existent props or patterns

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

## CLI Options

```bash
npx @raydenui/ai          # Start MCP server (stdio transport)
npx @raydenui/ai --help   # Show help message
```

## Related Packages

- [`@raydenui/ui`](https://www.npmjs.com/package/@raydenui/ui) — The React component library
- [Rayna UI Figma](https://www.figma.com/community/file/tUAP8Crure0g1eewihmYUp) — Design system source

## License

MIT
