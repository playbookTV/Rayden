# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

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

## Architecture

This is `@rayden/ui`, a React component library built on the Rayna UI Figma design system.

### Build Output
- tsup builds ESM + CJS bundles to `dist/`
- `@tailwindcss/cli` compiles `src/styles/globals.css` → `dist/styles.css`
- Two entry points: `index` (components) and `preset` (design tokens)

### Component Structure
Each component lives in `src/components/<Name>/`:
- `<Name>.tsx` — Component implementation using `forwardRef`
- `index.ts` — Re-exports component and types
- `<Name>.stories.tsx` — Storybook stories (also used as vitest browser tests)

### Styling Pattern
- All components use Tailwind CSS v4 with custom theme tokens
- Design tokens defined in `src/styles/globals.css` via `@theme` block
- Use `cn()` utility from `src/utils/cn.ts` for class merging (clsx + tailwind-merge)
- Token colors follow pattern: `primary-{50-900}`, `grey-{50-900}`, `success-{50-900}`, `error-{50-800}`, `warning-{50-800}`, `info-{400-500}`

### Exports
Components and types exported from `src/index.ts`. Consumers import:
- Components/types: `@rayden/ui`
- Design tokens: `@rayden/ui/preset`
- Styles: `@rayden/ui/styles.css`
