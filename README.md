<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/MacBook Air - 17.png">
  <source media="(prefers-color-scheme: light)" srcset="./public/MacBook Air - 17.png">
  <img alt="Rayden UI - Build UI faster. A React UI system designed for humans and AI." src="./public/MacBook Air - 17.png" width="100%">
</picture>

# Rayden UI

A modern, accessible React component library built with Tailwind CSS v4. Rayden UI brings the [Rayna UI](https://www.raynaui.com/) Figma design system to life with pixel-perfect React components.

[![npm version](https://img.shields.io/npm/v/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@raydenui/ui.svg)](https://www.npmjs.com/package/@raydenui/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-rayden--docs.vercel.app-F56630)](https://rayden-docs.vercel.app)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://main--683f465dfa671db004742598.chromatic.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/playbookTV/Rayden/pulls)

## Features

- **24+ Production-Ready Components** — Buttons, Inputs, Tables, Selects, Sidebars, and more
- **Pre-built Blocks** — Login forms, notifications, tables, and more ready to drop in
- **AI Compatibility** — `@raydenui/ai` package for reliable LLM code generation
- **Tailwind CSS v4** — Modern styling with custom design tokens
- **Fully Typed** — Complete TypeScript support with exported types
- **Accessible** — Built with ARIA attributes and keyboard navigation
- **Tree-Shakeable** — Import only what you need
- **Dual Format** — ESM and CommonJS builds included

## Installation

```bash
# npm
npm install @raydenui/ui

# pnpm
pnpm add @raydenui/ui

# yarn
yarn add @raydenui/ui
```

### Peer Dependencies

Rayden UI requires React 18 or higher:

```bash
npm install react react-dom
```

## Quick Start

### 1. Import the Styles

Add the Rayden UI stylesheet to your app's entry point:

```tsx
// App.tsx or main.tsx
import "@raydenui/ui/styles.css";
```

Or in CSS:

```css
/* globals.css */
@import "@raydenui/ui/styles.css";
```

### 2. Use Components

```tsx
import { Button, Input, Badge } from "@raydenui/ui";

function App() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Input
        label="Email"
        placeholder="you@example.com"
        helperText="We'll never share your email"
      />
      <Button variant="primary" size="lg">
        Subscribe
      </Button>
      <Badge color="success">Active</Badge>
    </div>
  );
}
```

## Tailwind Integration

Rayden UI ships pre-compiled CSS, so components work out of the box. However, if you want to use Rayden's design tokens in your own Tailwind classes (e.g., `bg-primary-400`, `text-grey-700`), you need additional configuration.

### Using Rayden Tokens in Your Code

Extend your Tailwind config with Rayden's color palette:

```js
// tailwind.config.js (Tailwind v3)
import { colors } from "@raydenui/ui/preset";

export default {
  theme: {
    extend: {
      colors,
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include Rayden UI components so Tailwind scans them
    "node_modules/@raydenui/ui/dist/**/*.js",
  ],
};
```

For Tailwind v4 with CSS-based config:

```css
/* app.css */
@import "tailwindcss";
@import "@raydenui/ui/styles.css";

@source "node_modules/@raydenui/ui/dist/**/*.js";
```

Or extend the theme in CSS:

```css
@import "tailwindcss";
@import "@raydenui/ui/styles.css";

@theme {
  --color-primary-400: #F56630;
  --color-primary-500: #EB5017;
  /* ... other tokens from @raydenui/ui/preset */
}
```

### Available Token Exports

```tsx
import {
  colors,      // Color palette (primary, grey, success, error, warning, info)
  shadows,     // Box shadows (soft, hard variants)
  spacing,     // Spacing scale (4px base)
  typography,  // Font sizes, line heights, letter spacing
  grid,        // Breakpoints and layout tokens
} from "@raydenui/ui/preset";
```

## Components

### Forms & Inputs

| Component | Description |
|-----------|-------------|
| [Button](./docs/components/Button.md) | Primary action buttons with variants and icon support |
| [ButtonGroup](./docs/components/ButtonGroup.md) | Horizontal grouping of related buttons |
| [Input](./docs/components/Input.md) | Text input with label, helper text, and validation states |
| [Select](./docs/components/Select.md) | Dropdown select with icons, avatars, and status indicators |
| [Checkbox](./docs/components/FormControl.md#checkbox) | Checkbox input with label and description |
| [Radio](./docs/components/FormControl.md#radio) | Radio button input with label and description |
| [Toggle](./docs/components/FormControl.md#toggle) | Switch/toggle input for boolean values |
| [Chip](./docs/components/Chip.md) | Compact input tags with close/filter actions |
| [FileUpload](./docs/components/FileUpload.md) | Drag-and-drop file upload with progress and states |

### Navigation

| Component | Description |
|-----------|-------------|
| [Tabs](./docs/components/Tabs.md) | Tabbed navigation with line and pill variants |
| [Breadcrumb](./docs/components/Breadcrumb.md) | Hierarchical page navigation |
| [Pagination](./docs/components/Pagination.md) | Page navigation with prev/next controls |
| [SidebarMenu](./docs/components/SidebarMenu.md) | Collapsible sidebar navigation with sections |
| [DropdownMenu](./docs/components/DropdownMenu.md) | Accessible dropdown menu with keyboard navigation |

### Data Display

| Component | Description |
|-----------|-------------|
| [Table](./docs/components/Table.md) | Data table with sorting, selection, and avatars |
| [Avatar](./docs/components/Avatar.md) | User avatar with image, initials, icon, and status |
| [ActivityFeed](./docs/components/ActivityFeed.md) | Activity timelines and notification feeds |
| [MetricsCard](./docs/components/MetricsCard.md) | Dashboard metric cards with 6 layout variations |
| [Icon](./docs/components/Icon.md) | 200+ icons with outline and solid variants |
| [EmptyStateIllustration](./docs/components/EmptyStateIllustration.md) | 19 empty state illustrations with custom palettes |

### Feedback

| Component | Description |
|-----------|-------------|
| [Alert](./docs/components/Alert.md) | Toast and banner notifications with actions |
| [Badge](./docs/components/Badge.md) | Status indicators and labels |
| [ProgressBar](./docs/components/ProgressBar.md) | Linear progress indicator |
| [ProgressCircle](./docs/components/ProgressCircle.md) | Circular progress indicator |
| [Tooltip](./docs/components/Tooltip.md) | Contextual information popover |

### Layout

| Component | Description |
|-----------|-------------|
| [Divider](./docs/components/Divider.md) | Content separator with optional label/button |

## Blocks

Pre-built UI patterns combining multiple components for common use cases. [View all blocks →](./docs/blocks.md)

| Block | Description |
|-------|-------------|
| [LoginBlock](./docs/blocks.md#loginblock) | Complete login form with social providers |
| [NotificationsBlock](./docs/blocks.md#notificationsblock) | Notification feed with actions and timestamps |
| [TableBlock](./docs/blocks.md#tableblock) | Full-featured data table with search and filters |
| [QuickSendBlock](./docs/blocks.md#quicksendblock) | Quick send interface for payments/transfers |
| [RecentTransactionsBlock](./docs/blocks.md#recenttransactionsblock) | Transaction history display |
| [EmptyStateBlock](./docs/blocks.md#emptystateblock) | Empty state with illustration and CTA |
| [SearchableTableBlock](./docs/blocks.md#searchabletableblock) | Table with integrated search |

```tsx
import { LoginBlock, NotificationsBlock } from "@raydenui/ui";

function App() {
  return (
    <LoginBlock
      variant="split"
      onSubmit={handleLogin}
      socialProviders={["google", "github"]}
    />
  );
}
```

## AI Integration

The `@raydenui/ai` package enables LLMs to reliably generate Rayden UI code without hallucination.

```bash
# Run directly with npx (no install needed)
npx @raydenui/ai

# Or install globally
npm install -g @raydenui/ai
```

### Features

- **Component Manifests** — Structured definitions of all components, props, and examples
- **Design Tokens** — Complete token system in JSON format
- **Composition Rules** — Guidelines for combining components correctly
- **MCP Server** — Model Context Protocol server for AI assistants

### Claude Desktop Integration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Claude Code Integration

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

### Programmatic Usage

```tsx
import { getComponentManifest, getAllManifests } from "@raydenui/ai/manifests";
import { tokens } from "@raydenui/ai/tokens";

// Get all component definitions
const manifests = getAllManifests();

// Get a specific component
const buttonManifest = getComponentManifest("Button");
```

See the full [AI Integration Guide](./docs/rayden-ai.md) for setup instructions.

## Design Tokens

Rayden UI includes a complete design token system extracted from the Rayna UI Figma design system.

### Using Tokens with Tailwind

All tokens are available as Tailwind CSS v4 theme variables:

```tsx
// Use token colors directly in Tailwind classes
<div className="bg-primary-400 text-grey-900">
  Primary background with grey text
</div>

// Custom shadows
<div className="shadow-soft-lg">
  Soft shadow effect
</div>
```

### Importing Tokens Programmatically

```tsx
import { colors, shadows, spacing, typography } from "@raydenui/ui/preset";

// Access tokens in JavaScript
console.log(colors.primary[400]); // "#F56630"
console.log(shadows.soft.lg);     // "0px 4px 6px..."
```

### Color Palette

| Scale | Primary | Secondary | Grey | Success | Error | Warning |
|-------|---------|-----------|------|---------|-------|---------|
| 50 | ![#FFECE5](https://via.placeholder.com/12/FFECE5/FFECE5.png) `#FFECE5` | ![#E3EFFC](https://via.placeholder.com/12/E3EFFC/E3EFFC.png) `#E3EFFC` | ![#F9FAFB](https://via.placeholder.com/12/F9FAFB/F9FAFB.png) `#F9FAFB` | ![#E7F6EC](https://via.placeholder.com/12/E7F6EC/E7F6EC.png) `#E7F6EC` | ![#FBEAE9](https://via.placeholder.com/12/FBEAE9/FBEAE9.png) `#FBEAE9` | ![#FEF6E7](https://via.placeholder.com/12/FEF6E7/FEF6E7.png) `#FEF6E7` |
| 400 | ![#F56630](https://via.placeholder.com/12/F56630/F56630.png) `#F56630` | ![#1671D9](https://via.placeholder.com/12/1671D9/1671D9.png) `#1671D9` | ![#98A2B3](https://via.placeholder.com/12/98A2B3/98A2B3.png) `#98A2B3` | ![#0F973D](https://via.placeholder.com/12/0F973D/0F973D.png) `#0F973D` | ![#D42620](https://via.placeholder.com/12/D42620/D42620.png) `#D42620` | ![#F3A218](https://via.placeholder.com/12/F3A218/F3A218.png) `#F3A218` |
| 700 | ![#AD3307](https://via.placeholder.com/12/AD3307/AD3307.png) `#AD3307` | ![#04326B](https://via.placeholder.com/12/04326B/04326B.png) `#04326B` | ![#344054](https://via.placeholder.com/12/344054/344054.png) `#344054` | ![#036B26](https://via.placeholder.com/12/036B26/036B26.png) `#036B26` | ![#9E0A05](https://via.placeholder.com/12/9E0A05/9E0A05.png) `#9E0A05` | ![#865503](https://via.placeholder.com/12/865503/865503.png) `#865503` |

See [Design Tokens Documentation](./docs/design-tokens.md) for the complete reference.

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/rayden.git
cd rayden

# Install dependencies
pnpm install

# Start Storybook
pnpm storybook
```

### Commands

```bash
pnpm build            # Build the library
pnpm dev              # Watch mode for development
pnpm typecheck        # Run TypeScript type checking
pnpm storybook        # Start Storybook on port 6006
pnpm build-storybook  # Build static Storybook
```

### Testing

Tests run via Storybook's Vitest addon with Playwright browser testing:

```bash
pnpm exec vitest              # Run all tests
pnpm exec vitest Button       # Run tests matching "Button"
pnpm exec vitest --watch      # Watch mode
```

### Project Structure

```
src/
├── components/           # React components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ...
├── styles/
│   └── globals.css       # Tailwind v4 theme tokens
├── utils/
│   └── cn.ts             # Class merging utility
├── index.ts              # Component exports
└── preset.ts             # Design token exports
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run `pnpm typecheck` and `pnpm exec vitest`
5. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
6. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

- Design system based on [Rayna UI](https://raynaui.com) by Rayna UI Team
- Built with [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Storybook](https://storybook.js.org/)

---

Made with care for the React community. By Ovalay Studios (https://ovalay.studio)