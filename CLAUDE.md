# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root Package (`@raydenui/ui`)
```bash
pnpm build          # Build library (tsup + Tailwind CSS)
pnpm dev            # Watch mode for development
pnpm typecheck      # Run TypeScript type checking
pnpm storybook      # Start Storybook on port 6006
pnpm build-storybook # Build static Storybook
```

Tests run via Storybook's vitest addon with Playwright browser testing:
```bash
pnpm exec vitest              # Run all tests
pnpm exec vitest Button       # Run tests matching "Button"
pnpm exec vitest --watch      # Watch mode
```

### Workspace Packages
```bash
# Documentation (packages/docs)
pnpm docs           # Start Nextra docs site on port 3001
pnpm docs:build     # Build docs for production

# AI Package (packages/rayden-ai)
pnpm --filter @raydenui/ai build      # Build MCP server + manifests
pnpm --filter @raydenui/ai dev        # Watch mode

# CLI Scaffolding (packages/create-rayden-app)
pnpm --filter create-rayden-app build # Build CLI
pnpm --filter create-rayden-app dev   # Watch mode
```

## Architecture

This is a pnpm monorepo with four packages:

```
.                     # @raydenui/ui — Main React component library
packages/
  rayden-ai/          # @raydenui/ai — MCP server for AI-assisted development
  docs/               # @raydenui/docs — Nextra documentation site
  create-rayden-app/  # create-rayden-app — CLI project scaffolding
```

### Root Package: `@raydenui/ui`

React component library built on the [Rayna UI](https://www.raynaui.com/) Figma design system.

**Build output:**
- tsup builds ESM + CJS bundles to `dist/`
- `@tailwindcss/cli` compiles `src/styles/globals.css` → `dist/styles.css`
- Three entry points: `index` (components), `preset` (design tokens), `icons`

**Component structure** — Each component lives in `src/components/<Name>/`:
- `<Name>.tsx` — Component implementation using `forwardRef`
- `index.ts` — Re-exports component and types
- `<Name>.stories.tsx` — Storybook stories (also used as vitest browser tests)

**Styling pattern:**
- All components use Tailwind CSS v4 with custom theme tokens
- Design tokens defined in `src/styles/globals.css` via `@theme` block
- Use `cn()` utility from `src/utils/cn.ts` for class merging (clsx + tailwind-merge)
- Token colors follow pattern: `primary-{50-900}`, `grey-{50-900}`, `success-{50-900}`, `error-{50-800}`, `warning-{50-800}`, `info-{400-500}`

**Consumer imports:**
- Components/types: `@raydenui/ui`
- Design tokens: `@raydenui/ui/preset`
- Icons: `@raydenui/ui/icons`
- Styles: `@raydenui/ui/styles.css`

### AI Package: `@raydenui/ai`

MCP (Model Context Protocol) server for AI-assisted UI generation. Provides component manifests, design tokens, and rules to prevent LLM hallucination.

**Key exports:**
- `@raydenui/ai/manifests` — Component prop definitions
- `@raydenui/ai/tokens` — Design tokens (JSON)
- `@raydenui/ai/anatomy` — Component structure definitions
- `@raydenui/ai/mcp` — MCP server handlers
- `@raydenui/ai/RAYDEN_RULES.md` — AI agent instructions

**MCP server binary:** `rayden-ai-mcp` (runs via `dist/mcp/server.js`)

**Design source:** Rayna UI Figma file key `tUAP8Crure0g1eewihmYUp`

### CLI Scaffolding: `create-rayden-app`

CLI tool for scaffolding new Rayden UI projects.

**Usage:**
```bash
npx create-rayden-app my-app                    # Interactive mode
npx create-rayden-app my-app -f vite -t landing --ts  # Non-interactive
```

**Frameworks:** `vite` (recommended), `nextjs`

**Templates (6):**
| Template | Description |
|----------|-------------|
| `blank` | Empty project, Rayden UI configured |
| `minimal` | Demo of core components |
| `landing` | Marketing page with hero, features, CTA |
| `dashboard` | Sidebar nav, tables, metrics |
| `ecommerce` | Products, cart, checkout |
| `blog` | Articles, categories, posts |

**Template structure** — Each template lives in `packages/create-rayden-app/templates/<framework>/<template>/`:
```
base/           # Shared files (package.json.ejs, globals.css, etc.)
typescript/     # TypeScript-specific files
javascript/     # JavaScript-specific files
```

Files with `.ejs` extension are processed with EJS templating during scaffold.

### Pre-built Blocks

Located in `src/blocks/`, these are composed UI patterns: LoginBlock, NotificationsBlock, TableBlock, QuickSendBlock, RecentTransactionsBlock, EmptyStateBlock, SearchableTableBlock
